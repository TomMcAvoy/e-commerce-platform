import fs from 'fs';
import path from 'path';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  meta?: any;
  service: string;
  userId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
}

class Logger {
  private serviceName: string;

  constructor(serviceName: string = 'ecommerce-api') {
    this.serviceName = serviceName;
  }

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private writeToFile(level: LogLevel, entry: LogEntry): void {
    const logFile = path.join(logsDir, `${level}.log`);
    const allLogsFile = path.join(logsDir, 'combined.log');
    const logLine = JSON.stringify(entry) + '\n';

    // Write to specific level file
    fs.appendFileSync(logFile, logLine);
    
    // Write to combined log file
    fs.appendFileSync(allLogsFile, logLine);
  }

  private formatConsoleOutput(entry: LogEntry): string {
    const colorCodes = {
      [LogLevel.ERROR]: '\x1b[31m', // Red
      [LogLevel.WARN]: '\x1b[33m',  // Yellow
      [LogLevel.INFO]: '\x1b[36m',  // Cyan
      [LogLevel.DEBUG]: '\x1b[37m'  // White
    };
    
    const resetCode = '\x1b[0m';
    const color = colorCodes[entry.level];
    
    const metaStr = entry.meta ? ` | Meta: ${JSON.stringify(entry.meta)}` : '';
    const userStr = entry.userId ? ` | User: ${entry.userId}` : '';
    const ipStr = entry.ip ? ` | IP: ${entry.ip}` : '';
    
    return `${color}[${entry.timestamp}] ${entry.level.toUpperCase()} [${entry.service}]: ${entry.message}${metaStr}${userStr}${ipStr}${resetCode}`;
  }

  private log(level: LogLevel, message: string, meta?: any, context?: any): void {
    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level,
      message,
      service: this.serviceName,
      ...(meta && { meta }),
      ...(context?.userId && { userId: context.userId }),
      ...(context?.requestId && { requestId: context.requestId }),
      ...(context?.ip && { ip: context.ip }),
      ...(context?.userAgent && { userAgent: context.userAgent })
    };

    // Console output in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(this.formatConsoleOutput(entry));
    }

    // File output
    this.writeToFile(level, entry);

    // In production, you might want to send to external services
    if (process.env.NODE_ENV === 'production' && level === LogLevel.ERROR) {
      // TODO: Send to external error tracking service (Sentry, LogRocket, etc.)
    }
  }

  error(message: string, meta?: any, context?: any): void {
    this.log(LogLevel.ERROR, message, meta, context);
  }

  warn(message: string, meta?: any, context?: any): void {
    this.log(LogLevel.WARN, message, meta, context);
  }

  info(message: string, meta?: any, context?: any): void {
    this.log(LogLevel.INFO, message, meta, context);
  }

  debug(message: string, meta?: any, context?: any): void {
    if (process.env.NODE_ENV === 'development' || process.env.LOG_LEVEL === 'debug') {
      this.log(LogLevel.DEBUG, message, meta, context);
    }
  }

  // Express middleware for request logging
  requestLogger() {
    return (req: any, res: any, next: any) => {
      const startTime = Date.now();
      const requestId = Math.random().toString(36).substr(2, 9);
      
      // Add request ID to request object for use in other logs
      req.requestId = requestId;

      const context = {
        requestId,
        userId: req.user?._id,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
      };

      this.info(`${req.method} ${req.originalUrl}`, {
        method: req.method,
        url: req.originalUrl,
        query: req.query,
        body: this.sanitizeBody(req.body),
        headers: this.sanitizeHeaders(req.headers)
      }, context);

      // Log response
      res.on('finish', () => {
        const duration = Date.now() - startTime;
        const level = res.statusCode >= 400 ? LogLevel.ERROR : LogLevel.INFO;
        
        this.log(level, `${req.method} ${req.originalUrl} - ${res.statusCode} in ${duration}ms`, {
          method: req.method,
          url: req.originalUrl,
          statusCode: res.statusCode,
          duration
        }, context);
      });

      next();
    };
  }

  // Sanitize sensitive data from logs
  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') return body;
    
    const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'creditCard'];
    const sanitized = { ...body };
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }

  private sanitizeHeaders(headers: any): any {
    if (!headers || typeof headers !== 'object') return headers;
    
    const sanitized = { ...headers };
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
    
    for (const header of sensitiveHeaders) {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }

  // Database operation logging
  dbOperation(operation: string, collection: string, query?: any, result?: any, error?: any): void {
    const level = error ? LogLevel.ERROR : LogLevel.DEBUG;
    const message = error 
      ? `Database ${operation} failed on ${collection}` 
      : `Database ${operation} on ${collection}`;
    
    const meta = {
      operation,
      collection,
      ...(query && { query: this.sanitizeQuery(query) }),
      ...(result && { 
        resultCount: Array.isArray(result) ? result.length : 1,
        resultType: typeof result
      }),
      ...(error && { error: error.message })
    };

    this.log(level, message, meta);
  }

  private sanitizeQuery(query: any): any {
    if (!query || typeof query !== 'object') return query;
    
    const sanitized = { ...query };
    const sensitiveFields = ['password', '$where'];
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }

  // Security event logging
  securityEvent(event: string, details: any, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'): void {
    const level = severity === 'critical' || severity === 'high' ? LogLevel.ERROR : LogLevel.WARN;
    
    this.log(level, `SECURITY EVENT: ${event}`, {
      event,
      severity,
      details
    });

    // In production, send critical security events to monitoring services immediately
    if (process.env.NODE_ENV === 'production' && (severity === 'critical' || severity === 'high')) {
      // TODO: Send to security monitoring service
    }
  }

  // Performance logging
  performance(operation: string, duration: number, threshold: number = 1000): void {
    const level = duration > threshold ? LogLevel.WARN : LogLevel.DEBUG;
    const message = duration > threshold 
      ? `SLOW OPERATION: ${operation} took ${duration}ms` 
      : `${operation} completed in ${duration}ms`;
    
    this.log(level, message, {
      operation,
      duration,
      threshold,
      isSlow: duration > threshold
    });
  }

  // Cleanup old log files (call this periodically, e.g., daily)
  cleanup(daysToKeep: number = 30): void {
    const files = fs.readdirSync(logsDir);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    for (const file of files) {
      const filePath = path.join(logsDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.mtime < cutoffDate) {
        fs.unlinkSync(filePath);
        this.info(`Cleaned up old log file: ${file}`);
      }
    }
  }
}

// Create default logger instance
export const logger = new Logger();

// Performance monitoring decorator
export function logPerformance(threshold: number = 1000) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      const className = target.constructor.name;
      const operationName = `${className}.${propertyName}`;

      try {
        const result = await method.apply(this, args);
        const duration = Date.now() - startTime;
        logger.performance(operationName, duration, threshold);
        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        logger.error(`${operationName} failed after ${duration}ms`, { error: (error as Error).message });
        throw error;
      }
    };
  };
}

// Database operation decorator
export function logDbOperation(collection: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const operation = propertyName;

      try {
        const result = await method.apply(this, args);
        logger.dbOperation(operation, collection, args[0], result);
        return result;
      } catch (error) {
        logger.dbOperation(operation, collection, args[0], null, error);
        throw error;
      }
    };
  };
}
