import { IJobStatus, JobWorkflowStatusType } from "../interfaces/IJobStatus";

export class JobStatus implements IJobStatus {
  id: string;
  title: string;
  createdAt: Date;
  initialized: boolean | null;
  outdated: boolean | null;
  data_status: JobWorkflowStatusType;
  ai_status: JobWorkflowStatusType;

  constructor({ id }: { id: string  }) {
    this.id = id;
    this.title = '';
    this.createdAt = new Date();
    this.initialized = null;
    this.outdated = null;
    this.data_status = null;
    this.ai_status = null;
  }

  toString(): string {
    return `JobStatus {
      id: ${this.id},
      title: ${this.title},
      createdAt: ${this.createdAt.toISOString()},
      initialized: ${this.initialized},
      outdated: ${this.outdated},
      data_status: ${this.data_status},
      ai_status: ${this.ai_status}
    }`;
  }
}