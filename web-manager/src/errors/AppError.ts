import { AppLogger } from "./AppLogger";
import { IError } from "./IError";

export class AppError extends Error implements IError {
  logger: AppLogger;
  date: string;

  constructor(message: string) {
    super(message);
    this.name = 'AppError';
    this.date = new Date().toISOString();
    this.logger = AppLogger.getInstance();
  }

  log(msg?: string) {
    let logMessage = `[${this.date}] ${this.name}: ${this.message}`;
    if (msg) logMessage += ` ${msg}`;
    if (!this.logger) console.error(`🔴 ${logMessage}`);
    else this.logger.error(logMessage, {
      error: logMessage,
      stack: this.stack,
    });
  }
}