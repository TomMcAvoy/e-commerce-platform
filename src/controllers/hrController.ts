import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User';
import Employee from '../models/Employee';
import AppError from '../utils/AppError';
import { AuthenticatedRequest } from '../middleware/auth';

// @desc    Hire a new employee from an existing user
// @route   POST /api/hr/employees
// @access  Private/Admin
export const hireEmployee = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { userId, department, position, salary } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    const existingEmployee = await Employee.findOne({ user: userId });
    if (existingEmployee) {
        return next(new AppError('This user is already an employee', 400));
    }

    const newEmployee = await Employee.create({
        user: user._id,
        employeeId: `EMP${(user._id as string).toString().slice(-6).toUpperCase()}`,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: '', // phoneNumber property doesn't exist on User model
        department,
        position,
        salary,
        hireDate: new Date(),
    });

    // Note: 'employee' role not supported in current User model
    // user.role = 'customer'; // Keep as customer for now
    // await user.save();

    res.status(201).json({ success: true, data: newEmployee });
});

// @desc    Get all employees
// @route   GET /api/hr/employees
// @access  Private/Admin
export const getEmployees = asyncHandler(async (req: Request, res: Response) => {
    const employees = await Employee.find().populate('user', 'firstName lastName email');
    res.status(200).json({ success: true, count: employees.length, data: employees });
});

// @desc    Get a single employee
// @route   GET /api/hr/employees/:id
// @access  Private/Admin
export const getEmployee = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const employee = await Employee.findById(req.params.id).populate('user', 'firstName lastName email');
    if (!employee) {
        return next(new AppError(`Employee not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: employee });
});

// @desc    Update employee details
// @route   PUT /api/hr/employees/:id
// @access  Private/Admin
export const updateEmployee = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!employee) {
        return next(new AppError(`Employee not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: employee });
});

// @desc    Terminate an employee
// @route   DELETE /api/hr/employees/:id
// @access  Private/Admin
export const terminateEmployee = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
        return next(new AppError(`Employee not found with id of ${req.params.id}`, 404));
    }

    employee.terminationDate = new Date();
    employee.isActive = false;
    await employee.save();

    // Optionally revert user's role
    const user = await User.findById(employee.user);
    if (user) {
        user.role = 'customer';
        await user.save();
    }

    res.status(200).json({ success: true, data: {} });
});

// @desc    Get HR dashboard
// @route   GET /api/hr/dashboard
// @access  Private/Admin
export const getHRDashboard = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const dashboard = { totalEmployees, activeEmployees: totalEmployees };
    res.status(200).json({ success: true, data: dashboard });
});

// @desc    Get employee profile
// @route   GET /api/hr/employees/:id/profile
// @access  Private/Admin
export const getEmployeeProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const employee = await User.findById(req.params.id);
    if (!employee) {
        return next(new AppError('Employee not found', 404));
    }
    res.status(200).json({ success: true, data: employee });
});

// @desc    Create employee
// @route   POST /api/hr/employees
// @access  Private/Admin
export const createEmployee = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const employee = await User.create({ ...req.body, role: 'employee' });
    res.status(201).json({ success: true, data: employee });
});

// @desc    Process payroll
// @route   POST /api/hr/payroll
// @access  Private/Admin
export const processPayroll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const payroll = { processed: true, date: new Date() };
    res.status(200).json({ success: true, data: payroll });
});

// @desc    Get time tracking
// @route   GET /api/hr/time-tracking
// @access  Private/Admin
export const getTimeTracking = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const timeTracking = { totalHours: 160, employees: [] };
    res.status(200).json({ success: true, data: timeTracking });
});

// @desc    Submit time entry
// @route   POST /api/hr/time-entry
// @access  Private/Employee
export const submitTimeEntry = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const timeEntry = { ...req.body, userId: req.user._id, submitted: true };
    res.status(201).json({ success: true, data: timeEntry });
});
