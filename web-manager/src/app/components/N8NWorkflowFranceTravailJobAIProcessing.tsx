'use client';

import { useEffect, useState } from "react";
import { CircleDotDashed } from "lucide-react";
import { JobWorkflowStatusType } from "../interfaces/IJobStatus";
import JobWorkflowStatusIcon from "./Icon/JobWorkflowStatusIcon";
import { N8NWorkflow } from "../lib/N8NWorkflow";
import { JobRepository } from "../dal/JobRepository";
import { FRANCE_TRAVAIL_JOB_BASE_URL } from "@/constants/default";
import { GetJobByOriginalIdError } from "../dal/errors/JobRepositoryError";

const n8nWorkflow = N8NWorkflow.getInstance();
const jobRepository = JobRepository.getInstance();

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
      
      // Get data from DB
      const source = `${FRANCE_TRAVAIL_JOB_BASE_URL}${jobId}`;
      jobRepository
        .getBySource({ source })
        .then((job) => {
          if (!job) throw new GetJobByOriginalIdError("Job not found.");
          if (!job._id) throw new GetJobByOriginalIdError("Job ID not found.");

          // Data processing
          const { _id } = job;
          n8nWorkflow
            .startFranceTravailAIWorkflow({ _id: _id.toString() })
            .then((response) => {
              const { error } = response
              if (error) setAiStatus('error');
              else setAiStatus('ok');
            })
            .catch((error) => {
              console.error(error);
              setAiStatus('error');
            })
            .finally(() => {
              setInProcessing(false);
            });
        })
        .catch((error) => {
          console.error(error);
          setAiStatus('error');
        })
        .finally(() => {
          setInProcessing(false);
        });
    }
  }, [start, inProcessing, aiStatus]);

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