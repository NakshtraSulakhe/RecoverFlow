/**
 * Logger utility for consistent logging across the application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
}

class Logger {
  private isDevelopment = import.meta.env.DEV

  private formatLog(level: LogLevel, message: string, context?: Record<string, any>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    }
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>) {
    const logEntry = this.formatLog(level, message, context)

    if (this.isDevelopment) {
      const logMethod = console[level] || console.log
      logMethod(`[${logEntry.timestamp}] [${level.toUpperCase()}] ${message}`, context || '')
    }

    // In production, you would send logs to a logging service
    // this.sendToLoggingService(logEntry)
  }

  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context)
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context)
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context)
  }

  error(message: string, error?: Error | Record<string, any>) {
    const context = error instanceof Error 
      ? { message: error.message, stack: error.stack }
      : error
    
    this.log('error', message, context)
  }
}

export const logger = new Logger()
