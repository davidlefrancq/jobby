import { useState } from "react";
import BtnLoading from "./Btn/BtnLoading";
import { N8NWorkflow } from "../lib/N8NWorkflow";

const n8nWorkflow = N8NWorkflow.getInstance();

interface MotivationEmailBtnProps {
  jobId: string;
  cvId: string;
}

export default function MotivationEmailBtn({ jobId, cvId }: MotivationEmailBtnProps) {
  const [inProgress, setInProgress] = useState(false);

  const handleClick = async () => {
    if (inProgress) return; // Prevent multiple clicks and wait for the current process to finish
    try {
      setInProgress(true);
      await n8nWorkflow.startCVMotivationEmailWorkflow({ jobId, cvId })
    } catch (err) {
      console.error("Error generating motivation letter: ", String(err));
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