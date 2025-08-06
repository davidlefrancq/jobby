'use client';

import { use, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { addAlert } from '@/app/store/alertsReducer';
import { 
  setFranceTravailStarted,
  setFranceTravailStatus,
  setLinkedInStarted,
  setLinkedInStatus,
} from '@/app/store/n8nReducer';
import { addNotification } from '@/app/store/notificationsReducer';
import { N8NWorkflow } from "../lib/N8NWorkflow";
import { JobRepository } from "../dal/JobRepository";
import { IJobEntity } from "@/types/IJobEntity";
import { ProcessingStageEnum, } from "@/types/ProcessingStageType";
import { IJobStatus, JobRunStatus } from "../interfaces/IJobStatus";
import N8NWorkflowJobStatues from "./N8NWorkflowJobStatues";

const jobRepository = JobRepository.getInstance();
const n8nWorkflow = N8NWorkflow.getInstance();

export default function N8NWorkflowFranceTravail() {
  const dispatch = useAppDispatch()
  const { isStartedWorkflows, franceTravailStarted } = useAppSelector(state => state.n8nReducer)

  // Initialized jobs states
  const [dateStart, setDateStart] = useState<Date | null>(null);
  const [dateEnd, setDateEnd] = useState<Date | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [jobs, setJobs] = useState<IJobEntity[]>([]);
  const [hasMoreJobs, setHasMoreJobs] = useState(true);
  const [isStartedGmailWorkflow, setIsStartedGmailWorkflow] = useState(false);
  const [isFinishedGmailWorkflow, setIsFinishedGmailWorkflow] = useState(false);
  const [isStartedDataProcessing, setIsStartedDataProcessing] = useState(false);
  const [isFinishedDataProcessing, setIsFinishedDataProcessing] = useState(false);
  const [isStartedAIProcessing, setIsStartedAIProcessing] = useState(false);
  const [isFinishedAIProcessing, setIsFinishedAIProcessing] = useState(false);

  // Progress states
  const [progress, setProgress] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(0);

  // Per-job UI status (badges)

  const [jobStatuses, setJobStatuses] = useState<Record<string, IJobStatus>>({});

  
  const setJobStatus = ({ id, title, createdAt, status }: IJobStatus) => {
    setJobStatuses(prev => ({ ...prev, [id]: { id, title, createdAt, status } }));
  }

  const incrementProgress = () => {
    setCompletedSteps(prev => {
      const next = prev + 1;
      const denom = Math.max(1, totalSteps);
      setProgress(Math.floor((next / denom) * 100));
      return next;
    });
  }

  const computeTotalSteps = (jobCount: number) => {
    // 1 (Gmail) + jobCount * 2 (Data + AI)
    return 1 + jobCount * 2;
  }

  const loadJobs = async (skip: number = 0) => {
    const limit = 50; // Number of jobs to load per request
    // FR: Récupère les jobs initialisés depuis la base de données.
    // EN: Fetches initialized jobs from the database.
    const result = await jobRepository.getAll({ limit, skip });
    if (result && result.length > 0) {

      // FR: Met à jour la liste des jobs avec les résultats récupérés.
      // EN: Updates the job list with the fetched results.
      const newJobs = result.filter(job => job.processing_stage === ProcessingStageEnum.initialized || job.processing_stage === ProcessingStageEnum.source_processed);
      const newJobList = skip === 0 ? [...newJobs] : [...jobs, ...newJobs];
      setJobs(newJobList);
      if (result.length < limit) setHasMoreJobs(false);
      else await loadJobs(skip + result.length); // Load more jobs if available
    }
    else setHasMoreJobs(false);
  };

  /**
   * FR: Démarre le workflow FranceTravail si ce n'est pas déjà fait.
   * EN: Starts the FranceTravail workflow if not already started.
   */
  const workflowFranceTravailGmailHandler = async () => {
    if (isStartedGmailWorkflow) return;
    setIsStartedGmailWorkflow(true);
    setDateStart(new Date());

    // FR: Met à jour l'état du workflow FranceTravail.
    // EN: Updates the FranceTravail workflow state.
    dispatch(setFranceTravailStarted(true));
    dispatch(setFranceTravailStatus('processing'));
    setIsStartedGmailWorkflow(true);
    setCompletedSteps(0);
    setProgress(0);

    try {
      // FR: Démarre le workflow Gmail pour FranceTravail.
      // EN: Starts the Gmail workflow for FranceTravail.
      const gmailWorkflowResponse = await n8nWorkflow.startFranceTravailGmailWorkflow();
      if (gmailWorkflowResponse.error) {
        dispatch(addAlert({ date: new Date().toISOString(), message: gmailWorkflowResponse.error, type: 'error' }));
        const isNotAlreadyRunning = !gmailWorkflowResponse.error.includes('already running');
        if (isNotAlreadyRunning) dispatch(setFranceTravailStatus('error'));
      }

      // FR: Charge les jobs si le workflow Gmail et se termine s'il y a plus de jobs à charger depuis la BDD.
      // EN: Loads jobs if the Gmail workflow is finished and there are more jobs to load from the database.
      await loadJobs();

      setIsFinishedGmailWorkflow(true);

    } catch (error) {
      dispatch(setFranceTravailStatus('error'));
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: `FranceTravail workflows has failed: ${String(error)}`,
        type: 'error'
      }));
    } finally {
      setIsFinishedGmailWorkflow(true);
    }
  }
  
  const franceTravailDataWorkflowHandler = async () => {
    if (isStartedDataProcessing) return;
    setIsStartedDataProcessing(true);

    try {
      // Sequential each job will be processed by Data workflow
      for (const job of jobs) {
        if (job._id) {
          // Updates the processing status of the job.
          setJobStatus({ id: job._id.toString(), title: job.title, createdAt: job.createdAt, status: 'data_processing' });
          // Starts the N8N Data workflow for the job.
          const dataWorkflowResponse = await n8nWorkflow.startFranceTravailDataWorkflow({ _id: job._id.toString() || '' });
          // Informing when error
          if (dataWorkflowResponse.error) {
            setJobStatus({ id: job._id.toString(), title: job.title, createdAt: job.createdAt, status: 'data_error' });
            dispatch(addAlert({
              date: new Date().toISOString(),
              message: `Data processing failed for job ${job._id}: ${dataWorkflowResponse.error}`,
              type: 'error'
            }));
          }
          // Informing when success
          else {
            setJobStatus({ id: job._id.toString(), title: job.title, createdAt: job.createdAt, status: 'data_ok' });
          }
          // Await 200 ms
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        incrementProgress();
      }

      // Reloads jobs after data workflow processing.
      setJobs([]);
      setHasMoreJobs(false);
      await loadJobs();
    } catch (error) {
      dispatch(setFranceTravailStatus('error'));
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: `Failed to start FranceTravail Data workflow: ${String(error)}`,
        type: 'error'
      }));
    } finally {
      setIsFinishedDataProcessing(true);
    }
  }

  const franceTravailAIWorkflowHandler = async () => {
    if (isStartedAIProcessing) return;
    setIsStartedAIProcessing(true);

    try {
      // FR: Traitement séquentiel de chaque job par le workflow AI N8N.
      // EN: Sequential processing of each job by the N8N AI workflow.
      for (const job of jobs) {
        if (job._id && job.processing_stage === ProcessingStageEnum.source_processed) {
          setJobStatus({ id: job._id.toString(), title: job.title, createdAt: job.createdAt, status: 'ai_processing' });
          const aiWorkflowResponse = await n8nWorkflow.startFranceTravailAIWorkflow({ _id: job._id.toString() });
          if (aiWorkflowResponse.error) {
            setJobStatus({ id: job._id.toString(), title: job.title, createdAt: job.createdAt, status: 'ai_error' });
            dispatch(addAlert({
              date: new Date().toISOString(),
              message: `AI processing failed for job ${job._id}: ${aiWorkflowResponse.error}`,
              type: 'error'
            }));
          } else {
            setJobStatus({ id: job._id.toString(), title: job.title, createdAt: job.createdAt, status: 'ai_ok' });
          }
        } else if (job._id) {
          setJobStatus({ id: job._id.toString(), title: job.title, createdAt: job.createdAt, status: 'skipped' });
        }
        incrementProgress();
      }
    } catch (error) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: `Failed to start FranceTravail AI workflow: ${String(error)}`,
        type: 'error'
      }));
    } finally {
      setDateEnd(new Date());
      setIsFinishedAIProcessing(true);
    }
  }

  /**
   * FR: Démarre les workflows si ce n'est pas déjà fait.
   * EN: Starts the workflows if not already started.
   */
  useEffect(() => {
    if (isStartedWorkflows && !franceTravailStarted) {      
      // TODO: Start workflows
      workflowFranceTravailGmailHandler()
        .then(() => {})
        .catch(error => {
          dispatch(addAlert({
            date: new Date().toISOString(),
            message: `Failed to start FranceTravail workflow: ${String(error)}`,
            type: 'error'
          }));
        });
    }
  }, [isStartedWorkflows]);



  /**
   * FR: 
   * EN: Workflows handler
   */
  useEffect(() => {
    if (isFinishedGmailWorkflow && !hasMoreJobs && !isStartedDataProcessing) {
      // FR: Démarre le workflow FranceTravail Data si tous les jobs sont chargés et qu'il n'est pas déjà en cours d'exécution.
      // EN: Starts the FranceTravail Data workflow if all jobs are loaded and it is not already running.
      franceTravailDataWorkflowHandler()
        .then()
        .catch(error => {
          dispatch(addAlert({
            date: new Date().toISOString(),
            message: `Failed to start FranceTravail Data workflow: ${String(error)}`,
            type: 'error'
          }));
        });
    }

    
    // FR: Démarre le workflow FranceTravail AI.
    // EN: Starts the FranceTravail AI workflow.
    if (isFinishedDataProcessing && !hasMoreJobs && !isStartedAIProcessing) {
      franceTravailAIWorkflowHandler()
        .then()
        .catch(error => {
          dispatch(addAlert({
            date: new Date().toISOString(),
            message: `Failed to start FranceTravail AI workflow: ${String(error)}`,
            type: 'error'
          }));
        });
    }
  }, [hasMoreJobs, isFinishedGmailWorkflow, isFinishedDataProcessing, isStartedDataProcessing, isStartedAIProcessing]);


  /**
   * FR: Met à jour le nombre total d'étapes en fonction des jobs.
   * EN: Updates the total number of steps based on the jobs.
   */
  useEffect(() => {
    if (jobs.length > 0) {
      const newTotalSteps = computeTotalSteps(jobs.length);
      setTotalSteps(newTotalSteps);
    }
  }, [jobs]);

  /**
   * FR: Incrémente la progression si tous les workflows sont terminés.
   * EN: Increments the progress if all workflows are finished.
   */
  useEffect(() => {
    if (isFinishedGmailWorkflow && isFinishedDataProcessing && isStartedAIProcessing) {
      if (completedSteps < totalSteps) incrementProgress();
    }
  }, [isFinishedGmailWorkflow, isFinishedDataProcessing, isStartedAIProcessing]);

  /**
   * FR: Met à jour la progression en fonction des étapes complétées et du total.
   * EN: Updates the progress based on completed steps and total steps.
   */
  useEffect(() => {
    let progressValue = 0;
    if (totalSteps > 0) progressValue = Math.floor((completedSteps / totalSteps) * 100);
    if (progressValue > 100) progressValue = 100;
    setProgress(progressValue);
  }, [completedSteps, totalSteps]);

  /**
   * FR: Met à jour l'état du workflow FranceTravail lorsque la progression atteint 100%.
   * EN: Updates the FranceTravail workflow status when progress reaches 100%.
   */
  useEffect(() => {
    if (progress >= 100) {
      dispatch(setFranceTravailStatus('success'));
      dispatch(addNotification({
        id: new Date().getTime(),
        message: 'FranceTravail workflow completed successfully.',
      }));
      
    }
  }, [progress]);

  /**
   * EN: Update duration
   */
  useEffect(() => {
    if (dateStart && dateEnd) {
      const durationInSeconds = Math.floor((dateEnd.getTime() - dateStart.getTime()) / 1000);
      setDuration(durationInSeconds);
    } else if (dateStart && !dateEnd) {
      setDuration(Math.floor((new Date().getTime() - dateStart.getTime()) / 1000));
    } else {
      setDuration(null);
    }
  }, [dateStart, dateEnd, jobs, jobStatuses, isFinishedAIProcessing, isFinishedDataProcessing, isFinishedGmailWorkflow]);

  /**
   * FR: Rendu de la barre de progression en fonction de la progression actuelle.
   * EN: Renders the progress bar based on the current progress.
   */
  const hiddenClass = isStartedWorkflows ? '' : 'hidden';
  return (
    <div className={`flex flex-col gap-4 p-4 ${hiddenClass}`}>
      {/* Progress bar */}
      <div className={`w-full h-2 bg-gray-200 rounded-full`}>
        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      {/* Progress information */}
      <div className="text-sm text-gray-500 text-center items-center justify-center" style={{ marginTop: '-10px' }}>
        <div>
          {`Progress: ${progress}%`}
        </div>
        <div className="italic">
          {`(${completedSteps}/${totalSteps} steps completed ${duration !== null && `in ${duration} seconds`})`}
        </div>
      </div>
      {/* Jobs list */}
      <div className="text-sm text-gray-500">
        {Object.keys(jobStatuses).length > 0 && <N8NWorkflowJobStatues jobStatuses={jobStatuses} />}
      </div>
    </div>
  );
}