export type ProcessingStage = {
  // Step 01 - Get data from email and save it in the database
  INITIALIZED: 'initialized'
  // Step 02 - Process the source URL to extract job details
  SOURCE_PROCESSED: 'source_processed'
  // Step 03 - Extract job details from the content
  AI_PROCESSED: 'ai_processed'  
}
