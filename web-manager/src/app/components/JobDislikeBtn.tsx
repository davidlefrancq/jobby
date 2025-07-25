import { IJobEntity } from "@/types/IJobEntity";
import { ThumbsDown } from "lucide-react";
import { RepositoryFactory } from "../dal/RepositoryFactory";
import { MouseEvent, useState } from "react";
import { GrowingSpinner } from "./GrowingSpinner";
import { useAppDispatch, useAppSelector } from "../store";
import { setDislikedJobs, removeLikedJob, removeUnratedJob } from "../store/jobsReducer";
import { addAlert } from "../store/alertsReducer";

const jobRepository = RepositoryFactory.getInstance().getJobRepository();

interface JobDislikeProps {
  job: IJobEntity;
}

export default function JobDislikeBtn({ job }: JobDislikeProps) {
  const dispatch = useAppDispatch();
  const { dislikedJobs } = useAppSelector(state => state.jobsReducer);

  const [inProcessing, setInProcessing] = useState(false);

  const handleDislikeJob = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!job || !job._id) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: "Cannot dislike job: Job entity is not valid.",
        type: "error"
      }));
      return;
    }

    if (job.preference === 'dislike') {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: "Job is already disliked.",
        type: "warning"
      }));
      return;
    }

    setInProcessing(true);
    try {
      const updatedJob = await jobRepository.update(job._id.toString(), { preference: 'dislike' });
      // Check if the job was updated successfully
      if (updatedJob && updatedJob._id) {
        // Remove the job from liked and unrated lists
        if (job.preference === 'like') dispatch(removeLikedJob(job._id.toString()));
        else if (!job.preference) dispatch(removeUnratedJob(job._id.toString()));
        // Add the job to disliked jobs
        const updatedDislikedJobs = [...dislikedJobs.filter((j) => j._id !== job._id), updatedJob];
        dispatch(setDislikedJobs(updatedDislikedJobs));
      }
      // Show failure message if the job was not updated
      else {
        dispatch(addAlert({
          date: new Date().toISOString(),
          message: `Job with ID ${job._id} could not be disliked.`,
          type: "error"
        }));
      }
    } catch (error) {
      // Show failure message if an error occurred
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: `Failed to dislike job: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: "error"
      }));
    } finally {
      setInProcessing(false);
    }
  };

  return (
    <button
      className={`
        px-4
        py-2
        text-white rounded
        ${inProcessing ?
          "bg-gray-300 hover:bg-gray-400 focus:ring-gray-200"
          : "bg-red-500 hover:bg-red-600 focus:ring-red-400"
        }
        focus:outline-none
        focus:ring-2
        focus:ring-opacity-50
        ${inProcessing ? "cursor-not-allowed" : ""}
      `}
      onClick={handleDislikeJob}
      disabled={inProcessing}
    >
      
      {inProcessing ? <GrowingSpinner /> : <ThumbsDown size={18} />}
    </button>
  );
}