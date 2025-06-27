import { useState } from "react";
import BtnLoading from "./Btn/BtnLoading";
import { N8NWorkflow } from "../lib/N8NWorkflow";

const n8nWorkflow = N8NWorkflow.getInstance();

interface MotivationLetterBtnProps {
  jobId: string;
  cvId: string;
}

export default function MotivationLetterBtn({ jobId, cvId }: MotivationLetterBtnProps) {
  const [inProgress, setInProgress] = useState(false);

  const handleClick = async () => {
    if (inProgress) return; // Prevent multiple clicks and wait for the current process to finish
    try {
      setInProgress(true);
      await n8nWorkflow.startCVMotivationLetterWorkflow({ jobId, cvId })
    } catch (err) {
      console.error("Error generating motivation letter: ", String(err));
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