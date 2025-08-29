'use client';

import { useEffect, useState } from "react";
import { CaptionsOff, CircleChevronDown, CircleDotDashed } from "lucide-react";
import { GrowingSpinner } from "./GrowingSpinner";
import { N8NWorkflow } from "../lib/N8NWorkflow";

const n8nWorkflow = N8NWorkflow.getInstance();

interface IN8NWorkflowFranceTravailJobInitProcessingProps {
  jobId: string;
  start: boolean;
  onUpdate: (status: null | boolean, outdated: boolean) => void;
}

export default function N8NWorkflowFranceTravailJobInitProcessing({ jobId, start, onUpdate }: IN8NWorkflowFranceTravailJobInitProcessingProps) {
  // Initialized job form states
  const [initStatus, setInitStatus] = useState<null | boolean>(null);
  const [inProcessing, setInProcessing] = useState<boolean>(false);
 
  /**
   * FR: Met à jour le statut de l'initialisation.
   * EN: Updates the initialization status.
   */
  useEffect(() => {
  }, [initStatus])

  /**
   * FR: Démarre l'initialisation.
   * EN: Starts the initialization.
   */
  useEffect(() => {
    if (start && !inProcessing && initStatus === null) {
      setInProcessing(true);
      
      // Init processing
      n8nWorkflow
        .startFranceTravailLoadingJobWorkflow({ originalJobId: jobId })
        .then((response) => {
          const { error } = response
          if (error) setInitStatus(false);
          else setInitStatus(true);
        })
        .catch((error) => {
          console.error(error);
          setInitStatus(false);
        })
        .finally(() => {
          setInProcessing(false);
        });

    }
  }, [start, inProcessing]);

  /**
   * FR: Affiche l'icône de statut appropriée en fonction du statut des données.
   * EN: Displays the appropriate status icon based on the data status.
   */
  return (
    <>
      {/* Not started */}
      {!start && initStatus === null && <CircleDotDashed size={18} className="text-gray-300 dark:text-gray-600" />}
      {/* In progress */}
      {start && inProcessing && <GrowingSpinner />}
      {/* Finished error */}
      {initStatus === false && <CaptionsOff size={18} className="text-red-500" />}
      {/* Finished success */}
      {initStatus === true && <CircleChevronDown size={16} className="text-green-500" />}
    </>
  );
}