'use client';

import { useEffect, useState } from "react";
import { CircleDotDashed } from "lucide-react";
import { JobWorkflowStatusType } from "../interfaces/IJobStatus";
import JobWorkflowStatusIcon from "./Icon/JobWorkflowStatusIcon";

interface IN8NWorkflowFranceTravailJobDataProcessingProps {
  jobId: string;
  initialStatus: JobWorkflowStatusType;
  start: boolean;
  onUpdate: (status: JobWorkflowStatusType) => void;
}

export default function N8NWorkflowFranceTravailJobDataProcessing({ jobId, initialStatus, start, onUpdate }: IN8NWorkflowFranceTravailJobDataProcessingProps) {
  
  // Initialized job form states
  const [dataStatus, setDataStatus] = useState<JobWorkflowStatusType>(initialStatus);
  const [inProcessing, setInProcessing] = useState<boolean>(false);
 
  /**
   * FR: Met à jour le statut du traitement des données.
   * EN: Updates the data processing status.
   */
  useEffect(() => {
    onUpdate(dataStatus);
  }, [dataStatus])

  /**
   * FR: Démarre le traitement des données.
   * EN: Starts the data processing.
   */
  useEffect(() => {
    if (start && !inProcessing && dataStatus === null) {
      setInProcessing(true);
      setDataStatus("processing");
      
      // TODO: Data processing
      // Randaom time 800ms to 2800ms
      const randomTime = Math.floor(Math.random() * (2800 - 800 + 1)) + 800;
      // Random result "ok" or "error" or "skipped"
      const resultList: JobWorkflowStatusType[] = ["ok", "error", "skipped"]
      const randomResult = resultList[Math.floor(Math.random() * 3)];
      // Simulate data processing
      setTimeout(() => {
        setDataStatus(randomResult);
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
      {dataStatus
        ? <JobWorkflowStatusIcon status={dataStatus} />
        : <CircleDotDashed size={18} className="text-gray-300 dark:text-gray-600" />
      }
    </>
  );
}