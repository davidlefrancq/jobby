import { useState } from "react";
import BtnLoading from "./Btn/BtnLoading";
import { N8NWorkflow } from "../lib/N8NWorkflow";
import { useAppDispatch } from "../store";
import { updateLikedJob } from "../store/jobsReducer";
import { addAlert } from "../store/alertsReducer";
import { RepositoryFactory } from "../dal/RepositoryFactory";

const n8nWorkflow = N8NWorkflow.getInstance();

interface MotivationEmailBtnProps {
  jobId: string;
  cvId: string;
}

const jobRepository = RepositoryFactory.getInstance().getJobRepository()

export default function MotivationEmailBtn({ jobId, cvId }: MotivationEmailBtnProps) {
  const dispatch = useAppDispatch()

  const [inProgress, setInProgress] = useState(false);

  const handleClick = async () => {
    if (inProgress) return; // Prevent multiple clicks and wait for the current process to finish
    try {
      setInProgress(true);
      await n8nWorkflow.startCVMotivationEmailWorkflow({ jobId, cvId })
      const job = await jobRepository.getById(jobId);
      if (job) dispatch(updateLikedJob(job));
      else {
        dispatch(addAlert({
          date: new Date().toISOString(),
          message: `Job with ID ${jobId} not found after motivation email generation.`,
          type: 'error',
        }));
      }
    } catch (err) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: `Error generating motivation email: ${String(err)}`,
        type: 'error',
      }));
    } finally {
      setInProgress(false);
    }
  };

  return (
    <BtnLoading
      title={'Mail'}
      width="100px"
      loading={inProgress}
      onClick={handleClick} />
  );
}