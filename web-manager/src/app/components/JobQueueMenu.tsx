'use client';

import { JobQueueEnum } from "@/constants/JobQueueEnum";
import { useAppDispatch, useAppSelector } from "../store";
import { setJobQueueSelected } from "../store/jobsReducer";

export default function JobQueueMenu() {
  const dispatch = useAppDispatch()
  const { jobQueueSelected } = useAppSelector(state => state.jobsReducer)

  const handleBtnUnrated = () => {
    dispatch(setJobQueueSelected(JobQueueEnum.unrated))
  }

  const handleBtnLiked = () => {
    dispatch(setJobQueueSelected(JobQueueEnum.liked))
  }

  const handleBtnDisliked = () => {
    dispatch(setJobQueueSelected(JobQueueEnum.disliked))
  }

  return (
    <div className="flex flex-row items-center justify-center w-full h-full space-x-4">
      <button
        className={`px-4 py-2 text-white rounded hover:bg-blue-600 w-1/2 sm:w-1/2 lg:w-1/4 xl:w-1/6 caret-transparent ${jobQueueSelected === JobQueueEnum.unrated ? 'bg-blue-600' : 'bg-blue-500 cursor-pointer'}`}
        onClick={handleBtnUnrated}
        disabled={jobQueueSelected === JobQueueEnum.unrated}
      >
        Unrated
      </button>
      <button
        className={`px-4 py-2 text-white rounded hover:bg-blue-600 w-1/2 sm:w-1/2 lg:w-1/4 xl:w-1/6 caret-transparent ${jobQueueSelected === JobQueueEnum.liked ? 'bg-blue-600' : 'bg-blue-500 cursor-pointer'}`}
        onClick={handleBtnLiked}
        disabled={jobQueueSelected === JobQueueEnum.liked}
      >
        Liked
      </button>
      <button
        className={`px-4 py-2 text-white rounded hover:bg-blue-600 w-1/2 sm:w-1/2 lg:w-1/4 xl:w-1/6 caret-transparent ${jobQueueSelected === JobQueueEnum.disliked ? 'bg-blue-600' : 'bg-blue-500 cursor-pointer'}`}
        onClick={handleBtnDisliked}
        disabled={jobQueueSelected === JobQueueEnum.disliked}
      >
        Disliked
      </button>
    </div>
  );
}