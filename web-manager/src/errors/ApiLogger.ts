import { ILogPayload } from "@/types/ILogPayload";

const VECTOR_ENDPOINT_DEFAULT = 'http://localhost:8687/';
const VECTOR_IS_ENABLED_DEFAULT = true;
const VECTOR_ENDPOINT = process.env.NEXT_PUBLIC_VECTOR_ENDPOINT || VECTOR_ENDPOINT_DEFAULT;
const VECTOR_IS_ENABLED =
  VECTOR_ENDPOINT === VECTOR_ENDPOINT_DEFAULT
    ? VECTOR_IS_ENABLED_DEFAULT
    : process.env.NEXT_PUBLIC_VECTOR_ENABLED?.toLowerCase().trim() === 'true';

export class ApiLogger {
  private static instance: ApiLogger;
  private instanceId: string = crypto.randomUUID();

  private constructor() {}

  public static getInstance(): ApiLogger {
    if (!ApiLogger.instance) {
      ApiLogger.instance = new ApiLogger();
    }
    
    // Log info use instanceId to track logs from the same instance
    ApiLogger.instance.info(`${ApiLogger.instance.instanceId} : ApiLogger instance loaded.`, {
      instanceId: ApiLogger.instance.instanceId,
      vectorEndpoint: VECTOR_ENDPOINT,
    });

    // Return the singleton instance
    return ApiLogger.instance;
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
      service: 'web-manager-api',
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
      service: 'web-manager-api',
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
      service: 'web-manager-api',
      message,
      context,
      timestamp: new Date().toISOString(),
    };
    this.log(logPayload);
  }
}