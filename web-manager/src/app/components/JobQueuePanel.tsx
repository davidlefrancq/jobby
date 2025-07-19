'use client';

import JobQueueDisliked from "./JobQueueDisliked";
import JobQueueLiked from "./JobQueueLiked";
import JobQueueUnrated from "./JobQueueUnrated";



export default function JobQueuePanel() {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1`}>
      <JobQueueUnrated />
      <JobQueueLiked />
      <JobQueueDisliked />
    </div>
  );
}