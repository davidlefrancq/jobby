import { IJobStatus } from "../interfaces/IJobStatus";

export class JobStatusesChecker {
  /**
   * Check if all jobs are successful
   */
  static isSuccessful(jobStatuses: Record<string, IJobStatus>): boolean {
    let isTrue = true;
    for (const status of Object.values(jobStatuses)) {
      if (!status.initialized) isTrue = false;
      else if (status.data_status !== 'ok') isTrue = false;
      else if (status.ai_status !== 'ok') isTrue = false;
    }
    return isTrue;
  }

  /**
   * Check if all jobs have finished with success or error
   */
  static isFailed(jobStatuses: Record<string, IJobStatus>): boolean {
    let isTrue = true;
    for (const status of Object.values(jobStatuses)) {
      if (!status.initialized) isTrue = false;
      else if (status.data_status !== 'error' && status.data_status !== 'ok') isTrue = false;
      else if (status.ai_status !== 'error' && status.ai_status !== 'ok') isTrue = false;
    }
    return isTrue;
  }
}
