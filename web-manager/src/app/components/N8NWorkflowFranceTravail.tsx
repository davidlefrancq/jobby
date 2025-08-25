'use client';

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { addAlert } from '@/app/store/alertsReducer';
import { 
  setFranceTravailStarted,
  setFranceTravailStatus,
} from '@/app/store/n8nReducer';
import { N8NWorkflow } from "../lib/N8NWorkflow";
import { JobRepository } from "../dal/JobRepository";
import { IJobEntity } from "@/types/IJobEntity";
import { ProcessingStageEnum, } from "@/types/ProcessingStageType";
import { IJobStatus, JobWorkflowStatusType } from "../interfaces/IJobStatus";
import N8NWorkflowJobStatues from "./N8NWorkflowJobStatues";
import CircleIconGreen from "./Icon/CircleIconGreen";
import { CircleIcon } from "./Icon/CircleIcon";
import CircleIconBlue from "./Icon/CircleIconBlue";

const GMAIL_WORKFLOW_STEPS = 1;
const STEPS_PER_JOB = 2;

const jobRepository = JobRepository.getInstance();
const n8nWorkflow = N8NWorkflow.getInstance();

export default function N8NWorkflowFranceTravail() {
  const dispatch = useAppDispatch()
  const { isStartedWorkflows } = useAppSelector(state => state.n8nReducer)

  // Initialized jobs states
  const [dateStart, setDateStart] = useState<Date | null>(null);
  const [dateEnd, setDateEnd] = useState<Date | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [jobs, setJobs] = useState<IJobEntity[]>([]);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [isStartedGmailWorkflow, setIsStartedGmailWorkflow] = useState(false);
  const [isFinishedGmailWorkflow, setIsFinishedGmailWorkflow] = useState(false);
  const [isStartedLoadingJobs, setIsStartedLoadingJobs] = useState(false);
  const [isFinishedLoadingJobs, setIsFinishedLoadingJobs] = useState(false);
  const [isStartedInitJobStatuses, setIsStartedInitJobStatuses] = useState(false);
  const [isFinishedInitJobStatuses, setIsFinishedInitJobStatuses] = useState(false);
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

  const initJobStatuses = () => {
    const initialStatuses: Record<string, IJobStatus> = {};
    jobs.forEach(job => {
      if (job._id) {
        let dataStatus: JobWorkflowStatusType = null;
        let aiStatus: JobWorkflowStatusType = null;
        switch (job.processing_stage) {
          case ProcessingStageEnum.initialized:
            dataStatus = null;
            aiStatus = null;
            break;
          case ProcessingStageEnum.source_processed:
            dataStatus = 'ok';
            aiStatus = null;
            break;
          case ProcessingStageEnum.ai_processed:
            dataStatus = 'ok';
            aiStatus = 'ok';
            break;
          default:
            dataStatus = null;
            aiStatus = null;
        }

        let outdated = false;
        if (job.outdated) {
          outdated = true;
        }

        initialStatuses[job._id.toString()] = {
          id: job._id.toString(),
          title: job.title || 'Unknown',
          createdAt: job.createdAt ? new Date(job.createdAt) : new Date(),
          initialized: true,
          data_status: dataStatus,
          ai_status: aiStatus,
          outdated,
        };
      }
    });
    setJobStatuses(initialStatuses);
  }

  const computeTotalSteps = (jobCount: number) => {
    // 1 (Gmail) + jobCount * 2 (Data + AI)
    // Total steps: Gmail workflow + Jobs * (Data + AI per job)
    return GMAIL_WORKFLOW_STEPS + jobCount * STEPS_PER_JOB;
  }

  const incrementProgress = () => {
    setCompletedSteps(prev => prev + 1);
  }

  const updateDuration = () => {
    if (dateStart && dateEnd) {
      const durationInSeconds = Math.floor((dateEnd.getTime() - dateStart.getTime()) / 1000);
      setDuration(durationInSeconds);
    } else if (dateStart) {
      setDuration(Math.floor((new Date().getTime() - dateStart.getTime()) / 1000));
    } else {
      setDuration(null);
    }
  };

  const loadJobs = async (jobList:IJobEntity[] = [], skip: number = 0): Promise<IJobEntity[]> => {
    console.log(`Loading jobs... (skip: ${skip})`);
    const limit = 50; // Number of jobs to load per request
    // FR: Récupère les jobs initialisés depuis la base de données.
    // EN: Fetches initialized jobs from the database.
    const result = await jobRepository.getAll({ limit, skip });
    if (result && result.length > 0) {
      for (const job of result) {
        const index = jobList.findIndex(j => j._id?.toString() === job._id?.toString());
        if (index === -1) {
          jobList.push(job);
        } else {
          jobList[index] = job;
        }
        console.log(`${jobList.length} jobs`)
      }

      if (result.length < limit) {
        // FR: Aucune tâche suplémentaire à charger
        // EN: No additional tasks available
        setIsFinishedLoadingJobs(true);
      } else {
        const nextSkip = skip + limit;
        await loadJobs(jobList, nextSkip);
      }
    }

    // FR: Aucune tâche suplémentaire disponible
    // EN: No additional tasks available
    else {
      setIsFinishedLoadingJobs(true);
    }

    return jobList;
  };

  /**
   * FR: Démarre le workflow de traiment des email FranceTravail si ce n'est pas déjà fait.
   * EN: Starts the FranceTravail email processing workflow if not already started.
   */
  const workflowFranceTravailGmailHandler = async () => {
    if (isStartedWorkflows && !isStartedGmailWorkflow) {
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
        // FR: Exécution du workflow Gmail FranceTravail.
        // EN: Executes the Gmail FranceTravail workflow.
        const gmailWorkflowResponse = await n8nWorkflow.startFranceTravailGmailWorkflow();
        if (gmailWorkflowResponse.error) {
          dispatch(addAlert({ date: new Date().toISOString(), message: gmailWorkflowResponse.error, type: 'error' }));
          const isNotAlreadyRunning = !gmailWorkflowResponse.error.includes('already running');
          if (isNotAlreadyRunning) dispatch(setFranceTravailStatus('error'));
        }
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
  }

  /**
   * FR: Démarre le workflow de traitement des données FranceTravail si ce n'est pas déjà fait.
   * EN: Starts the FranceTravail data processing workflow if not already started.
   */
  const franceTravailDataWorkflowHandler = async () => {
    if (isFinishedGmailWorkflow && !isStartedDataProcessing) {
      setIsStartedDataProcessing(true);
      try {
        for(const job of jobs) {
          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async work
          if (job._id) {
            const jobId = job._id.toString();
            setCurrentJobId(jobId);
            const status = jobStatuses[jobId];
            console.log({ status })
            if (status && status.data_status === null && !status.outdated) {
              // Update the status to processing
              status.data_status = 'processing';
              setJobStatuses(prev => ({ ...prev, [jobId]: status }));

              // Starts the N8N Data workflow for the job.
              const dataWorkflowResponse = await n8nWorkflow.startFranceTravailDataWorkflow({ _id: jobId });
              // Informing when error
              if (dataWorkflowResponse.error) {
                status.data_status = 'error';
                setJobStatuses(prev => ({ ...prev, [jobId]: status }));
                dispatch(addAlert({
                  date: new Date().toISOString(),
                  message: `Data processing failed for job ${jobId}: ${dataWorkflowResponse.error}`,
                  type: 'error'
                }));
              }
              // Informing when success
              else {
                // Reload job data from DB
                const data = await jobRepository.getById(jobId);
                if (data) {
                  // Update job data in the state
                  setJobs(prevJobs => prevJobs.map(j => j._id?.toString() === jobId ? data : j));

                  // Update job status
                  if (data.outdated) {
                    status.data_status = 'skipped';
                  } else {
                    status.data_status = 'ok';
                  }
                } else {
                  status.data_status = 'error';
                }
                setJobStatuses(prev => ({ ...prev, [jobId]: status }));
              }
              // Await 200 ms
              await new Promise(resolve => setTimeout(resolve, 200));

            } else if (status && status.outdated) {
              // Update the status to skipped
              status.data_status = 'skipped';
              setJobStatuses(prev => ({ ...prev, [jobId]: status }));
            }
          }
          incrementProgress();
        }
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
  }

  /**
   * FR: Démarre le workflow de traitement des données FranceTravail si ce n'est pas déjà fait.
   * EN: Starts the FranceTravail data processing workflow if not already started.
   */
  const franceTravailAIWorkflowHandler = async () => {
    if (isFinishedDataProcessing && !isStartedAIProcessing) {
      setIsStartedAIProcessing(true);

      try {
        for(const job of jobs) {
          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async work
          if (job._id) {
            const jobId = job._id.toString();
            setCurrentJobId(jobId);
            const status = jobStatuses[jobId];
            if (status && status.ai_status === null && !status.outdated) {
              // Update the status to processing
              status.ai_status = 'processing';
              setJobStatuses(prev => ({ ...prev, [jobId]: status }));

              const aiWorkflowResponse = await n8nWorkflow.startFranceTravailAIWorkflow({ _id: jobId });
              if (aiWorkflowResponse.error) {
                // const newStatus: IJobStatus = {...jobStatus, ai_status: 'error'};
                status.ai_status = 'error';
                setJobStatuses(prev => ({ ...prev, [jobId]: status }));
                dispatch(addAlert({
                  date: new Date().toISOString(),
                  message: `AI processing failed for job ${jobId}: ${aiWorkflowResponse.error}`,
                  type: 'error'
                }));
              } else {
                status.ai_status = 'ok';
                setJobStatuses(prev => ({ ...prev, [jobId]: status }));
              }
            } else if (status && status.outdated) {
              // Update the status to outdated
              status.ai_status = 'skipped';
              setJobStatuses(prev => ({ ...prev, [jobId]: status }));
            }
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
  }

  /**
   * Launch Workflows
   */
  useEffect(() => {
    // Start Gmail Workflow
    if (isStartedWorkflows) workflowFranceTravailGmailHandler().catch(console.error);
  }, [isStartedWorkflows]);

  /**
   * Launch loading jobs
   */
  useEffect(() => {
    if (isFinishedGmailWorkflow && !isStartedLoadingJobs) {
      setIsStartedLoadingJobs(true);
      loadJobs().then((jobList) => {
        // FR: Filtrer les jobs: récupère les jobs initialized et source_processed
        // EN: Filter jobs: retrieves initialized and source_processed jobs
        jobList = jobList.filter(job =>
          !job.outdated && (
            job.processing_stage === ProcessingStageEnum.initialized ||
            job.processing_stage === ProcessingStageEnum.source_processed
          )
        );
        setJobs(jobList);
      }).catch(console.error);
    }
  }, [isFinishedGmailWorkflow]);


  /**
   * Launch init jobs statues
   */
  useEffect(() => {
    if (isFinishedLoadingJobs) {
      setIsStartedInitJobStatuses(true);
      initJobStatuses();
      setIsFinishedInitJobStatuses(true);
      incrementProgress();
    }
  }, [isFinishedLoadingJobs]);

  /**
   * Launch Data Workflow
   */
  useEffect(() => {
    // Start Data Workflow
    if (isFinishedInitJobStatuses && isFinishedLoadingJobs) {
      franceTravailDataWorkflowHandler().catch(console.error)
    };
  }, [isFinishedInitJobStatuses, isFinishedLoadingJobs]);

  /**
   * Launch AI Workflow
   */
  useEffect(() => {
    // Start AI Workflow
    if (isFinishedDataProcessing) franceTravailAIWorkflowHandler().catch(console.error);
  }, [isFinishedDataProcessing]);

  /**
   * EN: Update duration
   */
  useEffect(() => {
    updateDuration();
  }, [dateStart, dateEnd, progress]);


  /**
   * Update progress
   */
  useEffect(() => {
    setProgress(Math.floor((completedSteps / totalSteps) * 100));
  }, [completedSteps, totalSteps]);

  /**
   * Finished
   */
  useEffect(() => {
    if (isFinishedAIProcessing) {
     dispatch(setFranceTravailStatus('success'));
    }
  }, [isFinishedAIProcessing])

  /**
   * FR: Met à jour le nombre total d'étapes en fonction des jobs.
   * EN: Updates the total number of steps based on the jobs.
   */
  useEffect(() => {
    if (jobs.length > 0) {
      const newTotalSteps = computeTotalSteps(jobs.length);
      setTotalSteps(newTotalSteps);
      initJobStatuses();
      setCurrentJobId(jobs[0]._id?.toString() || null);
    }
  }, [jobs]);

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
      {/* Statues */}
      <div className="flex items-center justify-between">
        {/* Gmail */}
        <div className="flex items-center">
          {!isStartedGmailWorkflow && <CircleIcon />}
          {isStartedGmailWorkflow && !isFinishedGmailWorkflow && <CircleIconBlue />}
          {isFinishedGmailWorkflow && <CircleIconGreen />}
          <span className="text-sm text-gray-500">Gmail</span>
        </div>
        {/* Data */}
        <div className="flex items-center">
          {!isStartedDataProcessing && <CircleIcon />}
          {isStartedDataProcessing && !isFinishedDataProcessing && <CircleIconBlue />}
          {isFinishedDataProcessing && <CircleIconGreen />}
          <span className="text-sm text-gray-500">Data</span>
        </div>
        {/* AI */}
        <div className="flex items-center">
          {!isStartedAIProcessing && <CircleIcon />}
          {isStartedAIProcessing && !isFinishedAIProcessing && <CircleIconBlue />}
          {isFinishedAIProcessing && <CircleIconGreen />}
          <span className="text-sm text-gray-500">AI</span>
        </div>
      </div>
      {/* Progress information */}
      <div className="text-sm text-gray-500 text-center items-center justify-center" style={{ marginTop: '-10px' }}>
        <div>
          {`Progress: ${progress}%`}
        </div>
        <div className="italic">
          {`(${completedSteps}/${totalSteps}${duration !== null ? ` in ${duration} seconds` : ''})`}
        </div>
      </div>
      {/* Jobs list */}
      <div className="text-sm text-gray-500">
        {Object.keys(jobStatuses).length > 0 && <N8NWorkflowJobStatues jobStatuses={jobStatuses} target={currentJobId} />}
      </div>
    </div>
  );
}