'use client';

import { IJobEntity } from "@/types/IJobEntity";
import { ThumbsUp } from "lucide-react";
import { JobRepository } from "../dal/JobRepository";
import { useAppDispatch } from "../store";
import { addAlert } from "../store/alertsReducer";
import { removeDislikedJob, addLikedJob } from "../store/jobsReducer";

interface BtnLikeProps {
  job: IJobEntity;
  onClose: () => void;
}

let jobRepository: JobRepository | null = null;

export default function BtnLike({ job, onClose }: BtnLikeProps) {
  const dispatch = useAppDispatch()

  const handleLike = async () => {
    try {
      // Assuming there's a dislikeJob function in the job service
      if (!jobRepository) jobRepository = JobRepository.getInstance();
      const result = await jobRepository.update(job._id.toString(), { preference: "like" });
      if (!result) {
        dispatch(addAlert({ date: new Date().toISOString(), message: "Failed to dislike job.", type: "error" }));
      } else {
        const dislikedJob: IJobEntity = result;
        dispatch(removeDislikedJob(dislikedJob._id.toString()));
        dispatch(addLikedJob(dislikedJob));
        if (onClose) onClose();
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
      className="text-gray-500 hover:text-green-600 transition group cursor-pointer"
      onClick={handleLike}
      title="Like"
    >
      <div className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center group-hover:border-green-400">
        <span className="text-xs mb-0.5 group-hover:text-green-600">
          <ThumbsUp size={18} />
        </span>
      </div>
    </button>
  );
}