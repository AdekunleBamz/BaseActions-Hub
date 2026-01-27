/**
 * Logging utility with log levels and formatting
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
  context?: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private userLevel: LogLevel = "info";
  private isEnabled = true;

  constructor() {
    if (typeof window !== "undefined") {
      // Check for debug mode in URL or local storage
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.has("debug")) {
        this.userLevel = "debug";
      } else {
        const storedLevel = localStorage.getItem("logLevel");
        if (storedLevel && storedLevel in LOG_LEVELS) {
          this.userLevel = storedLevel as LogLevel;
        }
      }

      // Check for environment
      if (process.env.NODE_ENV === "development") {
        this.userLevel = "debug";
      }
    }
  }

  public setLevel(level: LogLevel) {
    this.userLevel = level;
    if (typeof window !== "undefined") {
      localStorage.setItem("logLevel", level);
    }
  }

  public enable() {
    this.isEnabled = true;
  }

  public disable() {
    this.isEnabled = false;
  }

  private shouldLog(level: LogLevel): boolean {
    return (
      this.isEnabled && LOG_LEVELS[level] >= LOG_LEVELS[this.userLevel]
    );
  }

  private formatMessage(level: LogLevel, message: string, context?: string): string {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = context ? `[${context}]` : "";
    return `${timestamp} ${level.toUpperCase()} ${prefix} ${message}`;
  }

  private log(level: LogLevel, message: string, data?: unknown, context?: string) {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, context);
    const style = this.getStyle(level);

    if (data !== undefined) {
      console.groupCollapsed(`%c${formattedMessage}`, style);
      console.log(data);
      console.trace("Stack trace");
      console.groupEnd();
    } else {
      console.log(`%c${formattedMessage}`, style);
    }

    // Optional: Send to analytics or error tracking service
    this.report(level, message, data, context);
  }

  private getStyle(level: LogLevel): string {
    switch (level) {
      case "debug":
        return "color: #9E9E9E; font-weight: normal;";
      case "info":
        return "color: #2196F3; font-weight: bold;";
      case "warn":
        return "color: #FF9800; font-weight: bold;";
      case "error":
        return "color: #F44336; font-weight: bold;";
      default:
        return "";
    }
  }

  private report(level: LogLevel, message: string, data?: unknown, context?: string) {
    // Only report warnings and errors in production
    if (process.env.NODE_ENV === "production" && (level === "warn" || level === "error")) {
      // Integration with error reporting service would go here
      // e.g. Sentry.captureMessage(message, { level, extra: { data, context } });
    }
  }

  public debug(message: string, data?: unknown, context?: string) {
    this.log("debug", message, data, context);
  }

  public info(message: string, data?: unknown, context?: string) {
    this.log("info", message, data, context);
  }

  public warn(message: string, data?: unknown, context?: string) {
    this.log("warn", message, data, context);
  }

  public error(message: string, data?: unknown, context?: string) {
    this.log("error", message, data, context);
  }

  public create(context: string) {
    return {
      debug: (message: string, data?: unknown) => this.debug(message, data, context),
      info: (message: string, data?: unknown) => this.info(message, data, context),
      warn: (message: string, data?: unknown) => this.warn(message, data, context),
      error: (message: string, data?: unknown) => this.error(message, data, context),
    };
  }
}

export const logger = new Logger();
