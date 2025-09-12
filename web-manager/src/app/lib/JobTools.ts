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

  // Order jobs by date
  public static orderJobsByDate(jobs: IJobEntity[], params: { order: 'asc' | 'desc' }): IJobEntity[] {
    let sortedJobs = [...jobs];
    sortedJobs = sortedJobs.sort((a, b) => {
      if (params.order === 'asc') {
        if (a.date && b.date) return new Date(a.date).getTime() - new Date(b.date).getTime();
        else if (a.date) return -1;
        else if (b.date) return 1;
        return 0;
      } else {
        if (b.date && a.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
        else if (b.date) return -1;
        else if (a.date) return 1;
        return 0;
      }
    });
    return sortedJobs;
  }
}