'use client';

import { useEffect, useState } from "react";
import { CircleDotDashed } from "lucide-react";
import { JobWorkflowStatusType } from "../interfaces/IJobStatus";
import JobWorkflowStatusIcon from "./Icon/JobWorkflowStatusIcon";
import { N8NWorkflow } from "../lib/N8NWorkflow";
import { JobRepository } from "../dal/JobRepository";
import { GetJobByOriginalIdError } from "../dal/errors/JobRepositoryError";
import { FRANCE_TRAVAIL_JOB_BASE_URL } from "@/constants/default";

const n8nWorkflow = N8NWorkflow.getInstance();
const jobRepository = JobRepository.getInstance();

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
   * FR: Vérifie si le statut initial change pour "skipped".
   * EN: Checks if the initial status changes to "skipped".
   */
  useEffect(() => {
    if (initialStatus === 'skipped') {
      setDataStatus('skipped');
    }
  }, [initialStatus]);

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
            .startFranceTravailDataWorkflow({ _id: _id.toString() })
            .then((response) => {
              const { error } = response
              if (error) setDataStatus('error');
              else setDataStatus('ok');
            })
            .catch((error) => {
              console.error(error);
              setDataStatus('error');
            })
            .finally(() => {
              setInProcessing(false);
            });
        })
        .catch((error) => {
          console.error(error);
          setDataStatus('error');
        })
        .finally(() => {
          setInProcessing(false);
        });
  }, [start, inProcessing, dataStatus]);

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