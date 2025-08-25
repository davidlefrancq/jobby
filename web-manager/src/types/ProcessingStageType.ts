export enum ProcessingStageEnum {
  initialized = 'initialized',
  source_processed = 'source_processed',
  ai_processed = 'ai_processed'
}

export type ProcessingStageType = keyof typeof ProcessingStageEnum;