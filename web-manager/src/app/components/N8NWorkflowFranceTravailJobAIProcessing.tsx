'use client';

import { useEffect, useState } from "react";
import { CircleDotDashed } from "lucide-react";
import { JobWorkflowStatusType } from "../interfaces/IJobStatus";
import JobWorkflowStatusIcon from "./Icon/JobWorkflowStatusIcon";

interface IN8NWorkflowFranceTravailJobAIProcessingProps {
  jobId: string;
  initialStatus: JobWorkflowStatusType;
  start: boolean;
  onUpdate: (status: JobWorkflowStatusType) => void;
}

export default function N8NWorkflowFranceTravailJobAIProcessing({ jobId, initialStatus, start, onUpdate }: IN8NWorkflowFranceTravailJobAIProcessingProps) {

  // Initialized job form states
  const [aiStatus, setAiStatus] = useState<JobWorkflowStatusType>(initialStatus);
  const [inProcessing, setInProcessing] = useState<boolean>(false);
 
  /**
   * FR: Met à jour le statut du traitement des données.
   * EN: Updates the data processing status.
   */
  useEffect(() => {
    onUpdate(aiStatus);
  }, [aiStatus])

  /**
   * FR: Démarre le traitement des données.
   * EN: Starts the data processing.
   */
  useEffect(() => {
    if (start && !inProcessing && aiStatus === null) {
      setInProcessing(true);
      setAiStatus("processing");
      
      // TODO: Data processing
      // Randaom time 800ms to 2800ms
      const randomTime = Math.floor(Math.random() * (2800 - 800 + 1)) + 800;
      // Random result "ok" or "error" or "skipped"
      const resultList: JobWorkflowStatusType[] = ["ok", "error", "skipped"]
      const randomResult = resultList[Math.floor(Math.random() * 3)];
      // Simulate data processing
      setTimeout(() => {
        setAiStatus(randomResult);
        setInProcessing(false);
      }, randomTime);
    }
  }, [start]);

  /**
   * FR: Affiche l'icône de statut appropriée en fonction du statut des données.
   * EN: Displays the appropriate status icon based on the data status.
   */
  return (
    <>
      {aiStatus !== null
        ? <JobWorkflowStatusIcon status={aiStatus} />
        : <CircleDotDashed size={18} className="text-gray-300 dark:text-gray-600" />
      }
    </>
  );
}