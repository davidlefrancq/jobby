'use client';

import { IJobEntity } from "@/types/IJobEntity";
import { ThumbsDown } from "lucide-react";
import { JobRepository } from "../dal/JobRepository";
import { useAppDispatch } from "../store";
import { addAlert } from "../store/alertsReducer";
import { removeLikedJob, addDislikedJob } from "../store/jobsReducer";

interface BtnDislikeProps {
  job: IJobEntity;
}

let jobRepository: JobRepository | null = null;

export default function BtnDislike({ job }: BtnDislikeProps) {
  const dispatch = useAppDispatch()

  const handleDislike = async () => {
    try {
      // Assuming there's a dislikeJob function in the job service
      if (!jobRepository) jobRepository = JobRepository.getInstance();
      const result = await jobRepository.update(job._id.toString(), { preference: "dislike" });
      console.log({ result })
      if (!result) {
        dispatch(addAlert({ date: new Date().toISOString(), message: "Failed to dislike job.", type: "error" }));
      } else {
        const dislikedJob: IJobEntity = result;
        dispatch(removeLikedJob(dislikedJob._id.toString()));
        dispatch(addDislikedJob(dislikedJob));
      }
    } catch (error) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: `Error disliking job: ${error instanceof Error ? error.message : String(error)}`,
        type: "error"
      }));
    }
  };

  return (
    <button
      // className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center group-hover:border-red-400"
      className="text-gray-500 hover:text-red-600 transition group cursor-pointer"
      onClick={handleDislike}
      title="Dislike"
    >
      <div className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center group-hover:border-red-400">
        <span className="text-xs mt-0.5 group-hover:text-red-600">
          <ThumbsDown size={18} />
        </span>
      </div>
    </button>
  );
}