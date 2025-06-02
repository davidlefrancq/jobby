import { ILogPayload } from "@/types/ILogPayload";

const VECTOR_ENDPOINT = process.env.NEXT_PUBLIC_VECTOR_ENDPOINT || 'http://localhost:8687/';
const VECTOR_IS_ENABLED = process.env.NEXT_PUBLIC_VECTOR_ENABLED ?  process.env.NEXT_PUBLIC_VECTOR_ENABLED.toLowerCase() === 'true' : false;

export class AppLogger {
  private static instance: AppLogger;
  private instanceId: string = crypto.randomUUID();

  private constructor() {}

  public static getInstance(): AppLogger {
    if (!AppLogger.instance) {
      AppLogger.instance = new AppLogger();
    }
    
    // Log info use instanceId to track logs from the same instance
    AppLogger.instance.info(`${AppLogger.instance.instanceId} : ApiLogger instance loaded.`, {
      instanceId: AppLogger.instance.instanceId,
      vectorEndpoint: VECTOR_ENDPOINT,
    });

    // Return the singleton instance
    return AppLogger.instance;
  }

  private async sendLog(payload: ILogPayload): Promise<void> {
    try {
      const response = await fetch(`${VECTOR_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error('Failed to send log:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending log:', error);
    }
  }

  /** Make a log */
  private async log(payload: ILogPayload): Promise<void> {
    if (VECTOR_IS_ENABLED) await this.sendLog(payload);
    else console.log(payload);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public info(message: string, context?: Record<string, any>): void {
    const logPayload: ILogPayload = {
      level: 'info',
      service: 'web-manager-app',
      message,
      context,
      timestamp: new Date().toISOString(),
    };
    this.log(logPayload);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public warn(message: string, context?: Record<string, any>): void {
    const logPayload: ILogPayload = {
      level: 'warn',
      service: 'web-manager-app',
      message,
      context,
      timestamp: new Date().toISOString(),
    };
    this.log(logPayload);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public error(message: string, context?: Record<string, any>): void {
    const logPayload: ILogPayload = {
      level: 'error',
      service: 'web-manager-app',
      message,
      context,
      timestamp: new Date().toISOString(),
    };
    this.log(logPayload);
  }
}