import { IJobEntity } from "@/types/IJobEntity";

export class JobTools {
  public static getSourceName(job: IJobEntity): string {
    let sourceName = 'N/A';

    if (job.source) {
      try {
        const url = new URL(job.source);
        const hostnameParts = url.hostname.split('.');
        if (hostnameParts.length > 1) {
          sourceName = hostnameParts[hostnameParts.length - 2];
        } else {
          sourceName = url.hostname;
        }
      } catch (error) {
        console.error(`Error parsing job source URL: ${job.source}`, error);
      }
    }

    return sourceName;
  }
}