'use client';

import JobQueueDisliked from "./JobQueueDisliked";
import JobQueueLiked from "./JobQueueLiked";
import JobQueueMenu from "./JobQueueMenu";
import JobQueueUnrated from "./JobQueueUnrated";



export default function JobQueuePanel() {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1`}>
      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-1/2 z-50">
        <JobQueueMenu />
      </div>

      <JobQueueUnrated />
      <JobQueueLiked />
      <JobQueueDisliked />
    </div>
  );
}