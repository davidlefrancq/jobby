import { useState } from "react";
import BtnLoading from "./Btn/BtnLoading";
import { N8NWorkflow } from "../lib/N8NWorkflow";
import { RepositoryFactory } from "../dal/RepositoryFactory";
import { useAppDispatch } from "../store";
import { updateLikedJob, updateDislikedJob } from "../store/jobsReducer";
import { addAlert } from "../store/alertsReducer";
import { JOB_DISLIKED, JOB_LIKED } from "@/types/IJobEntity";

const n8nWorkflow = N8NWorkflow.getInstance();

interface MotivationLetterBtnProps {
  jobId: string;
  cvId: string;
}

const jobRepository = RepositoryFactory.getInstance().getJobRepository()

export default function MotivationLetterBtn({ jobId, cvId }: MotivationLetterBtnProps) {
  const dispatch = useAppDispatch()

  const [inProgress, setInProgress] = useState(false);

  const handleClick = async () => {
    if (inProgress) return; // Prevent multiple clicks and wait for the current process to finish
    try {
      setInProgress(true);
      await n8nWorkflow.startCVMotivationLetterWorkflow({ jobId, cvId })
      const job = await jobRepository.getById(jobId);
      if (job) {
        switch (job.interest_indicator) {
          case JOB_LIKED:
            dispatch(updateLikedJob(job));
            break;
          case JOB_DISLIKED:
            dispatch(updateDislikedJob(job));
            break;
          default:
            dispatch(addAlert({
              date: new Date().toISOString(),
              message: `Job with ID ${jobId} has an unknown interest indicator after motivation letter generation.`,
              type: 'warning',
            }));
            break;
        }
      }
      else {
        dispatch(addAlert({
          date: new Date().toISOString(),
          message: `Job with ID ${jobId} not found after motivation letter generation.`,
          type: 'error',
        }));
      }
    } catch (err) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: `Error generating motivation letter: ${String(err)}`,
        type: 'error',
      }));
    } finally {
      setInProgress(false);
    }
  };

  return (
    <BtnLoading
      title={'Letter'}
      width="100px"
      loading={inProgress}
      onClick={handleClick} />
  );
}