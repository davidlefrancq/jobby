/**
 * Represents the status of a job during its workflow lifecycle.
 */
export type JobWorkflowStatusType = null | 'processing' | 'ok' | 'error' | 'skipped'

export interface IJobStatus {
  id: string
  title: string
  createdAt: Date | undefined
  initialized: null | boolean
  outdated: null | boolean
  data_status: JobWorkflowStatusType
  ai_status: JobWorkflowStatusType
}
