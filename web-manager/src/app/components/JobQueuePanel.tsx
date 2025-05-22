'use client';

import JobQueueLiked from "./JobQueueLiked";
import JobQueueMenu from "./JobQueueMenu";
import JobQueueUnrated from "./JobQueuUnrated";

export default function JobQueuePanel() {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1`}>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-2xl font-bold">Job Queue</h1>
      </div>

      <JobQueueMenu />

      <JobQueueUnrated />
      <JobQueueLiked />

    </div>
  );
}