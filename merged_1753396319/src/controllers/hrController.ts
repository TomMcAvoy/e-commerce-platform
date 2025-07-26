import { Request, Response, NextFunction } from 'express'
import { AuthenticatedRequest, ApiResponse, PaginatedResponse } from '../types'
import User from '../models/User'
import { Employee, TimeEntry, PayrollRecord } from '../models/HRModels'
import AppError from '../utils/AppError'

interface Employee {
  _id?: string
  employeeId: string
  userId: string
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth: Date
    socialSecurityNumber?: string
    address: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
  }
  employmentInfo: {
    hireDate: Date
    department: string
    position: string
    reportingManager?: string
    employmentType: 'full-time' | 'part-time' | 'contract' | 'temporary'
    status: 'active' | 'inactive' | 'terminated' | 'on-leave'
    salary: {
      amount: number
      currency: string
      payFrequency: 'weekly' | 'bi-weekly' | 'monthly' | 'annually'
    }
  }
  benefits: {
    healthInsurance: boolean
    dentalInsurance: boolean
    retirementPlan: boolean
    paidTimeOff: number
    sickLeave: number
    vacationDays: number
  }
  performance: {
    lastReviewDate?: Date
    nextReviewDate?: Date
    rating?: number
    goals: string[]
    achievements: string[]
  }
  training: {
    completedCourses: Array<{
      courseName: string
      completionDate: Date
      certificateId?: string
    }>
    requiredTraining: string[]
  }
}

interface Payroll {
  _id?: string
  employeeId: string
  payPeriod: {
    start: Date
    end: Date
  }
  earnings: {
    regularHours: number
    overtimeHours: number
    regularPay: number
    overtimePay: number
    bonuses: number
    commissions: number
    grossPay: number
  }
  deductions: {
    federalTax: number
    stateTax: number
    socialSecurity: number
    medicare: number
    healthInsurance: number
    retirement401k: number
    otherDeductions: number
    totalDeductions: number
  }
  netPay: number
  payDate: Date
  status: 'draft' | 'approved' | 'paid' | 'cancelled'
}

interface TimeEntry {
  _id?: string
  employeeId: string
  date: Date
  clockIn?: Date
  clockOut?: Date
  breakTime: number
  totalHours: number
  overtime: number
  project?: string
  notes?: string
  status: 'pending' | 'approved' | 'rejected'
  approvedBy?: string
}

// @desc    Get HR dashboard
// @route   GET /api/hr/dashboard
// @access  Private (HR/Admin)
export const getHRDashboard = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // Employee statistics
    const totalEmployees = await User.countDocuments({ role: { $in: ['employee', 'manager', 'admin'] } })
    const activeEmployees = await User.countDocuments({ 
      role: { $in: ['employee', 'manager', 'admin'] },
      isActive: true 
    })
    const newHiresThisMonth = await User.countDocuments({
      role: { $in: ['employee', 'manager', 'admin'] },
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    })

    // Department breakdown (simulated)
    const departmentBreakdown = [
      { department: 'Engineering', count: Math.floor(totalEmployees * 0.4) },
      { department: 'Sales', count: Math.floor(totalEmployees * 0.25) },
      { department: 'Marketing', count: Math.floor(totalEmployees * 0.15) },
      { department: 'Operations', count: Math.floor(totalEmployees * 0.1) },
      { department: 'HR', count: Math.floor(totalEmployees * 0.05) },
      { department: 'Finance', count: Math.floor(totalEmployees * 0.05) }
    ]

    // Performance metrics (simulated)
    const performanceMetrics = {
      averageRating: 4.2,
      completedReviews: Math.floor(activeEmployees * 0.8),
      pendingReviews: Math.floor(activeEmployees * 0.2),
      trainingCompletion: 85.4
    }

    // Attendance overview (simulated)
    const attendanceOverview = {
      presentToday: Math.floor(activeEmployees * 0.92),
      absentToday: Math.floor(activeEmployees * 0.03),
      onLeaveToday: Math.floor(activeEmployees * 0.05),
      averageAttendance: 94.2
    }

    const dashboard = {
      employeeStats: {
        total: totalEmployees,
        active: activeEmployees,
        newHires: newHiresThisMonth,
        turnoverRate: 3.2 // Simulated annual turnover rate
      },
      departmentBreakdown,
      performanceMetrics,
      attendanceOverview,
      upcomingEvents: [
        { event: 'Annual Performance Reviews', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
        { event: 'Benefits Enrollment', date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
        { event: 'Team Building Event', date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) }
      ]
    }

    res.status(200).json({
      success: true,
      data: dashboard
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all employees
// @route   GET /api/hr/employees
// @access  Private (HR/Admin)
export const getEmployees = async (
  req: Request,
  res: Response<PaginatedResponse<any>>,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const skip = (page - 1) * limit

    let filter: any = { role: { $in: ['employee', 'manager', 'admin'] } }

    if (req.query.department) {
      // TODO: Add department field to User model
      filter.department = req.query.department
    }

    if (req.query.status) {
      filter.isActive = req.query.status === 'active'
    }

    if (req.query.search) {
      filter.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ]
    }

    const employees = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await User.countDocuments(filter)

    // Transform to employee format (would be actual Employee model in real implementation)
    const employeeData = employees.map(user => ({
      _id: user._id,
      employeeId: `EMP${user._id.toString().slice(-6).toUpperCase()}`,
      personalInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phoneNumber || '',
      },
      employmentInfo: {
        hireDate: user.createdAt,
        department: 'Engineering', // TODO: Add to User model
        position: user.role,
        status: 'active', // TODO: Add isActive field to User model
        employmentType: 'full-time'
      }
    }))

    res.status(200).json({
      success: true,
      data: employeeData,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create new employee
// @route   POST /api/hr/employees
// @access  Private (HR/Admin)
export const createEmployee = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      personalInfo,
      employmentInfo,
      benefits,
      initialPassword = 'TempPassword123!'
    } = req.body

    // Create user account first
    const user = await User.create({
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName,
      email: personalInfo.email,
      password: initialPassword,
      phoneNumber: personalInfo.phone,
      role: employmentInfo.position || 'employee',
      isActive: true
    })

    // TODO: Create actual Employee model record
    const employee = {
      _id: new Date().getTime().toString(),
      employeeId: `EMP${user._id.toString().slice(-6).toUpperCase()}`,
      userId: user._id,
      personalInfo,
      employmentInfo: {
        ...employmentInfo,
        hireDate: new Date()
      },
      benefits: benefits || {
        healthInsurance: false,
        dentalInsurance: false,
        retirementPlan: false,
        paidTimeOff: 15,
        sickLeave: 10,
        vacationDays: 10
      }
    }

    res.status(201).json({
      success: true,
      data: employee,
      message: 'Employee created successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get employee profile
// @route   GET /api/hr/employees/:id
// @access  Private (HR/Admin/Self)
export const getEmployeeProfile = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params

    const user = await User.findById(id).select('-password')
    if (!user) {
      return next(new AppError('Employee not found', 404))
    }

    // TODO: Get from actual Employee model
    const employeeProfile = {
      _id: user._id,
      employeeId: `EMP${user._id.toString().slice(-6).toUpperCase()}`,
      personalInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phoneNumber || '',
        dateOfBirth: new Date('1990-01-01'), // TODO: Add to User model
      },
      employmentInfo: {
        hireDate: user.createdAt,
        department: 'Engineering', // TODO: Add to User model
        position: user.role,
        status: 'active', // TODO: Add isActive field to User model
        employmentType: 'full-time',
        salary: {
          amount: 75000, // TODO: Add to Employee model
          currency: 'USD',
          payFrequency: 'annually'
        }
      },
      performance: {
        rating: 4.2,
        lastReviewDate: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000),
        nextReviewDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000),
        goals: ['Complete project certification', 'Improve team collaboration'],
        achievements: ['Led successful product launch', 'Mentored junior developers']
      },
      training: {
        completedCourses: [
          { courseName: 'Safety Training', completionDate: new Date(), certificateId: 'CERT001' }
        ],
        requiredTraining: ['Annual Compliance Training', 'Data Security Training']
      }
    }

    res.status(200).json({
      success: true,
      data: employeeProfile
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Process payroll
// @route   POST /api/hr/payroll/process
// @access  Private (HR/Admin)
export const processPayroll = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { payPeriodStart, payPeriodEnd, employeeIds } = req.body

    if (!payPeriodStart || !payPeriodEnd) {
      return next(new AppError('Pay period start and end dates are required', 400))
    }

    // TODO: Implement actual payroll calculation from time entries and employee salary data
    const payrollRecords = []
    const employees = employeeIds || await User.find({ 
      role: { $in: ['employee', 'manager', 'admin'] },
      isActive: true 
    }).select('_id')

    for (const emp of employees) {
      const empId = typeof emp === 'string' ? emp : emp._id
      
      // Simulate payroll calculation
      const regularPay = 3000 // Base salary calculation
      const overtimePay = 450
      const grossPay = regularPay + overtimePay
      const totalDeductions = grossPay * 0.25 // Approximate 25% total deductions
      const netPay = grossPay - totalDeductions

      const payrollRecord = {
        _id: new Date().getTime().toString() + empId,
        employeeId: empId,
        payPeriod: {
          start: new Date(payPeriodStart),
          end: new Date(payPeriodEnd)
        },
        earnings: {
          regularHours: 80,
          overtimeHours: 10,
          regularPay,
          overtimePay,
          bonuses: 0,
          commissions: 0,
          grossPay
        },
        deductions: {
          federalTax: grossPay * 0.12,
          stateTax: grossPay * 0.06,
          socialSecurity: grossPay * 0.062,
          medicare: grossPay * 0.0145,
          healthInsurance: 150,
          retirement401k: grossPay * 0.04,
          otherDeductions: 0,
          totalDeductions
        },
        netPay,
        payDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: 'approved'
      }

      payrollRecords.push(payrollRecord)
    }

    res.status(200).json({
      success: true,
      data: {
        payrollRecords,
        summary: {
          totalEmployees: payrollRecords.length,
          totalGrossPay: payrollRecords.reduce((sum, record) => sum + record.earnings.grossPay, 0),
          totalNetPay: payrollRecords.reduce((sum, record) => sum + record.netPay, 0),
          totalDeductions: payrollRecords.reduce((sum, record) => sum + record.deductions.totalDeductions, 0)
        }
      },
      message: 'Payroll processed successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get time tracking data
// @route   GET /api/hr/timetracking
// @access  Private (HR/Admin/Self)
export const getTimeTracking = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { employeeId, dateFrom, dateTo } = req.query

    const startDate = dateFrom ? new Date(dateFrom as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const endDate = dateTo ? new Date(dateTo as string) : new Date()

    // TODO: Implement actual TimeEntry model and queries
    // For now, simulate time tracking data
    const timeEntries = []
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))

    for (let i = 0; i < days; i++) {
      const entryDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
      
      // Skip weekends
      if (entryDate.getDay() === 0 || entryDate.getDay() === 6) continue

      const clockIn = new Date(entryDate.setHours(9, Math.floor(Math.random() * 15), 0))
      const clockOut = new Date(entryDate.setHours(17, Math.floor(Math.random() * 60), 0))
      const totalHours = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60)
      const overtime = totalHours > 8 ? totalHours - 8 : 0

      timeEntries.push({
        _id: `${employeeId || 'EMP001'}-${entryDate.toISOString().split('T')[0]}`,
        employeeId: employeeId || 'EMP001',
        date: entryDate,
        clockIn,
        clockOut,
        breakTime: 1, // 1 hour break
        totalHours: totalHours - 1, // Subtract break time
        overtime,
        status: 'approved'
      })
    }

    const summary = {
      totalHours: timeEntries.reduce((sum, entry) => sum + entry.totalHours, 0),
      totalOvertime: timeEntries.reduce((sum, entry) => sum + entry.overtime, 0),
      daysWorked: timeEntries.length,
      averageHoursPerDay: timeEntries.length > 0 
        ? timeEntries.reduce((sum, entry) => sum + entry.totalHours, 0) / timeEntries.length 
        : 0
    }

    res.status(200).json({
      success: true,
      data: {
        timeEntries,
        summary,
        period: { start: startDate, end: endDate }
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Submit time entry
// @route   POST /api/hr/timetracking/entries
// @access  Private (Employee/Manager/Admin)
export const submitTimeEntry = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { date, clockIn, clockOut, breakTime, project, notes } = req.body

    if (!date || !clockIn || !clockOut) {
      return next(new AppError('Date, clock in, and clock out times are required', 400))
    }

    const entryDate = new Date(date)
    const clockInTime = new Date(clockIn)
    const clockOutTime = new Date(clockOut)
    
    if (clockOutTime <= clockInTime) {
      return next(new AppError('Clock out time must be after clock in time', 400))
    }

    const totalMinutes = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60)
    const totalHours = (totalMinutes - (breakTime || 0)) / 60
    const overtime = totalHours > 8 ? totalHours - 8 : 0

    const timeEntry = {
      _id: new Date().getTime().toString(),
      employeeId: req.user._id,
      date: entryDate,
      clockIn: clockInTime,
      clockOut: clockOutTime,
      breakTime: breakTime || 0,
      totalHours: Math.round(totalHours * 100) / 100,
      overtime: Math.round(overtime * 100) / 100,
      project: project || '',
      notes: notes || '',
      status: 'pending'
    }

    // TODO: Save to actual TimeEntry model

    res.status(201).json({
      success: true,
      data: timeEntry,
      message: 'Time entry submitted successfully'
    })
  } catch (error) {
    next(error)
  }
}
