'use client';

import ErrorsPanel from './ErrorsPanel';
import N8NWorkflowPanel from './N8NWorkflowPanel';
import JobQueuePanel from './JobQueuePanel';

export default function JobBoard() {
  return (
    <>
      <N8NWorkflowPanel />
      <ErrorsPanel />
      <JobQueuePanel />
    </>
  );
}
