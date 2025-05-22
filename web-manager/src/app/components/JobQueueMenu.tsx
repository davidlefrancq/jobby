'use client';

import { JobQueueEnum } from "@/constants/JobQueueEnum";
import { useAppDispatch, useAppSelector } from "../store";
import { setJobQueueSelected } from "../store/jobsReducer";

export default function JobQueueMenu() {
  const dispatch = useAppDispatch()
  const { jobQueueSelected } = useAppSelector(state => state.jobsReducer)

  const handleBtnUnrated = () => {
    dispatch(setJobQueueSelected(JobQueueEnum.Unrated))
  }

  const handleBtnLiked = () => {
    dispatch(setJobQueueSelected(JobQueueEnum.Liked))
  }

  return (
    <div className="flex flex-row items-center justify-center w-full h-full space-x-4">
      <button
        className={`px-4 py-2 text-white rounded hover:bg-blue-600 w-1/2 sm:w-1/2 lg:w-1/4 xl:w-1/9 ${jobQueueSelected === JobQueueEnum.Unrated ? 'bg-blue-600' : 'bg-blue-500 cursor-pointer'}`}
        onClick={handleBtnUnrated}
        disabled={jobQueueSelected === JobQueueEnum.Unrated}
      >
        Unrated
      </button>
      <button
        className={`px-4 py-2 text-white rounded hover:bg-blue-600 w-1/2 sm:w-1/2 lg:w-1/4 xl:w-1/9 ${jobQueueSelected === JobQueueEnum.Liked ? 'bg-blue-600' : 'bg-blue-500 cursor-pointer'}`}
        onClick={handleBtnLiked}
        disabled={jobQueueSelected === JobQueueEnum.Liked}
      >
        Liked
      </button>
    </div>
  );
}