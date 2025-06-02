'use client';

import { IJobEntity } from "@/types/IJobEntity";
import { Trash2 } from "lucide-react";
import { JobRepository } from "../dal/JobRepository";
import { useAppDispatch } from "../store";
import { addAlert } from "../store/alertsReducer";
import { removeDislikedJob, removeLikedJob, removeUnratedJob } from "../store/jobsReducer";

interface BtnRemoveProps {
  job: IJobEntity;
  onRemove?: () => void;
}

let jobRepository: JobRepository | null = null;

export default function BtnRemove({ job, onRemove }: BtnRemoveProps) {
  const dispatch = useAppDispatch()

  const handleRemove = async () => {
    try {
      // Assuming there's a dislikeJob function in the job service
      if (!jobRepository) jobRepository = JobRepository.getInstance();
      await jobRepository.delete(job._id.toString());

      if(job.preference === null) dispatch(removeUnratedJob(job._id.toString()));
      if(job.preference === 'like') dispatch(removeLikedJob(job._id.toString()));
      if(job.preference === 'dislike') dispatch(removeDislikedJob(job._id.toString()));
      
      if (onRemove) onRemove();
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
      className="text-gray-500 hover:text-red-600 transition group cursor-pointer"
      onClick={handleRemove}
      title="Like"
    >
      <div className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center group-hover:border-red-400">
        <span className="text-xs mb-0.5 group-hover:text-red-600">
          <Trash2 size={18} />
        </span>
      </div>
    </button>
  );
}