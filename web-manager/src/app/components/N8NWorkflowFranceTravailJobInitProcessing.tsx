'use client';

import { useEffect, useState } from "react";
import { CaptionsOff, CircleChevronDown, CircleDotDashed } from "lucide-react";
import { GrowingSpinner } from "./GrowingSpinner";

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
    onUpdate(initStatus, !initStatus);
  }, [initStatus, inProcessing])

  /**
   * FR: Démarre l'initialisation.
   * EN: Starts the initialization.
   */
  useEffect(() => {
    if (start && !inProcessing && initStatus === null) {
      setInProcessing(true);
      
      // TODO: Data processing
      // Simulate data processing
      const randomTime = Math.floor(Math.random() * (2800 - 800 + 1)) + 800;
      setTimeout(() => {
        // Random result "ok" or "error" or "skipped"
        // const randomResult: boolean = Math.random() < 0.5;
        const randomResult: boolean = true;
        setInitStatus(randomResult);
        setInProcessing(false);
      }, randomTime);
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