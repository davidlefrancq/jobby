import { IError } from "./IError";

export class ApiError extends Error implements IError {
  date: string;

  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
    this.date = new Date().toISOString();
  }

  log(msg?: string) {
    let logMessage = `[${this.date}] ${this.name}: ${this.message}`;
    if (msg) logMessage += ` ${msg}`;
    console.error(`🔴 ${logMessage}`);
  }
}