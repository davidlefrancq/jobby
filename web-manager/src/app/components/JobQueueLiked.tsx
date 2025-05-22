'use client';

import { IJobEntity } from "@/types/IJobEntity";
import { useAppSelector } from "../store";
import JobTable from "./JobTable";
import { JobQueueEnum } from "@/constants/JobQueueEnum";

export default function JobQueueLiked() {
  const { likedJobs, jobQueueSelected } = useAppSelector(state => state.jobsReducer)

  // TODO: load liked jobs

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 ${jobQueueSelected === JobQueueEnum.Liked ? '' : 'hidden'}`}>
      <JobTable jobs={likedJobs} onEdit={(job: IJobEntity) => console.log({ job })} onView={(job: IJobEntity) => console.log({ job })} />
    </div>
  );
}