export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface ILogPayload {
  level: LogLevel;
  service: string;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: Record<string, any>;
  timestamp?: string;
}