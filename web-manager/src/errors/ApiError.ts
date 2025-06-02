import { ApiLogger } from "@/errors/ApiLogger";
import { IError } from "./IError";

export class ApiError extends Error implements IError {
  logger: ApiLogger;
  date: string;

  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
    this.date = new Date().toISOString();
    this.logger = ApiLogger.getInstance();
  }

  log(msg?: string) {
    let logMessage = `[${this.date}] ${this.name}: ${this.message}`;
    if (msg) logMessage += ` ${msg}`;
    console.error(`🔴 ${logMessage}`);
    this.logger.error(logMessage, {
      error: logMessage,
      stack: this.stack,
    });
  }
}