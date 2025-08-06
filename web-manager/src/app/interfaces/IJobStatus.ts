export type JobRunStatus =
  | 'initialized'
  | 'data_processing'
  | 'data_ok'
  | 'data_error'
  | 'ai_processing'
  | 'ai_ok'
  | 'ai_error'
  | 'skipped'
  | 'outdated';

export interface IJobStatus { id: string; title: string, createdAt: Date | undefined, status: JobRunStatus; }