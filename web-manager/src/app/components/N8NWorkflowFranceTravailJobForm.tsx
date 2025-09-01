'use client';

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { Calendar, CalendarOff, CirclePlay, CirclePlus, CircleX, Cpu, Database, PackagePlus, ReceiptText } from "lucide-react";
import { IJobStatus } from "../interfaces/IJobStatus";
import JobWorkflowStatusIcon from "./Icon/JobWorkflowStatusIcon";
import N8NWorkflowFranceTravailJobDataProcessing from "./N8NWorkflowFranceTravailJobDataProcessing";
import N8NWorkflowFranceTravailJobAIProcessing from "./N8NWorkflowFranceTravailJobAIProcessing";
import N8NWorkflowFranceTravailJobInitProcessing from "./N8NWorkflowFranceTravailJobInitProcessing";
import { setFranceTravailStatus, setManualJobIds, setManualJobStatuses } from "../store/n8nReducer";
import { JobStatusesChecker } from "../lib/JobStatusesChecker";
import { AppLogger } from "@/errors/AppLogger";
import { JobStatus } from "../bo/JobStatus";

const logger = AppLogger.getInstance();

export default function N8NWorkflowFranceTravailJobForm() {
  const dispatch = useAppDispatch()
  const { isStartedWorkflows, manualJobIds, manualJobStatuses } = useAppSelector(state => state.n8nReducer)
  const { autoMode } = useAppSelector(state => state.menuReducer)

  // Initialized job form states
  const [newJobIds, setNewJobIds] = useState<string>('');
  const [start, setStart] = useState<boolean>(false);
  const [jobIdInitProcessing, setJobIdInitProcessing] = useState<string | null>(null);
  const [jobIdDataProcessing, setJobIdDataProcessing] = useState<string | null>(null);
  const [jobIdAiProcessing, setJobIdAiProcessing] = useState<string | null>(null);

  /**
   * FR: Initialisation des statuts des jobs
   * EN: Initialize job statuses
   */
  const initJobStatuses = () => {
    // Initialize new job statuses
    const newStatuses: Record<string, IJobStatus> = {};
    for (const id of manualJobIds) {
      if (!manualJobStatuses[id]) {
        const newStatus = new JobStatus({ id })
        newStatuses[id] = newStatus;
      }
    }
    // Add new job statuses
    dispatch(setManualJobStatuses(newStatuses));
    logger.info(`Initialized job statuses for IDs: ${Object.keys(newStatuses).join(', ')}`);
  };

  // FR: Gérer l'ajout de nouveaux ID de travail
  // EN: Handle adding new job IDs
  const handleAddJobId = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Split the input string into an array of IDs on ',' or ';'
    const ids = newJobIds.split(/[,;]/).map(id => id.trim()).filter(id => id);
    // Delete double value in ids
    const uniqueIds = Array.from(new Set(ids));
    // Filter out IDs that are already in the list
    const idsWithoutNews: string[] = manualJobIds.filter(id => !uniqueIds.includes(id));
    // Update
    const newIdList = [...idsWithoutNews, ...uniqueIds].sort((a, b) => a.localeCompare(b));
    dispatch(setManualJobIds(newIdList));
    setNewJobIds('');
    logger.info(`Added new job IDs: ${uniqueIds.join(', ')}`);
  };

  const handleUpdateJobInitStatus = (id: string, status: IJobStatus['initialized'], outdated: boolean) => {
    if (!manualJobStatuses[id] || manualJobStatuses[id].initialized === status) return;
    const newJobStatuses = { ...manualJobStatuses };
    newJobStatuses[id].initialized = status;
    newJobStatuses[id].outdated = outdated;
    if (outdated) {
      newJobStatuses[id].data_status = 'skipped';
      newJobStatuses[id].ai_status = 'skipped';
    }
    // setJobStatuses(newJobStatuses);
    dispatch(setManualJobStatuses(newJobStatuses));
    logger.info(`Job ID ${id} statuses updated to initialized: ${status}, outdated: ${outdated}, data_status: ${newJobStatuses[id].data_status}, ai_status: ${newJobStatuses[id].ai_status}`);
  };

  const handleUpdateJobDataStatus = (id: string, status: IJobStatus['data_status']) => {
    if (!manualJobStatuses[id] || manualJobStatuses[id].data_status === status) return;
    const newJobStatuses = { ...manualJobStatuses };
    newJobStatuses[id].data_status = status;
    dispatch(setManualJobStatuses(newJobStatuses));
    logger.info(`Job ID ${id} data_status updated to: ${status}`);
  }

  const handleUpdateJobAIStatus = (id: string, status: IJobStatus['ai_status']) => {
    if (!manualJobStatuses[id] || manualJobStatuses[id].ai_status === status) return;
    const newJobStatuses = { ...manualJobStatuses };
    newJobStatuses[id].ai_status = status;
    dispatch(setManualJobStatuses(newJobStatuses));
    logger.info(`Job ID ${id} ai_status updated to: ${status}`);
  };

  const handleRemoveJobId = (id: string) => {
    const newJobIds = manualJobIds.filter(jobId => jobId !== id);
    dispatch(setManualJobIds(newJobIds));

    const newJobStatuses = { ...manualJobStatuses };
    delete newJobStatuses[id];
    dispatch(setManualJobStatuses(newJobStatuses));
    logger.info(`Removed job ID: ${id}`);
  }

  const nextInitProcessing = async () => {
    if (manualJobStatuses) {
      const nextJob = Object.values(manualJobStatuses).find(job => job.initialized === null);
      if (nextJob) {
        setJobIdInitProcessing(nextJob.id);
      } else {
        setJobIdInitProcessing(null);
      }
      logger.info(`Next job ID for initialization processing: ${nextJob ? nextJob.id : 'none'}`);
    }
  }

  const nextDataProcessing = async () => {
    if (manualJobStatuses) {
      const nextJob = Object.values(manualJobStatuses).find(job => job.data_status === null && job.initialized === true);
      if (nextJob) {
        setJobIdDataProcessing(nextJob.id);
      } else {
        setJobIdDataProcessing(null);
      }
      logger.info(`Next job ID for data processing: ${nextJob ? nextJob.id : 'none'}`);
    }
  };

  const nextAiProcessing = async () => {
    if (manualJobStatuses) {
      const nextJob = Object.values(manualJobStatuses).find(job => job.ai_status === null && job.data_status === 'ok');
      if (nextJob) {
        setJobIdAiProcessing(nextJob.id);
      } else {
        setJobIdAiProcessing(null);
      }
      logger.info(`Next job ID for AI processing: ${nextJob ? nextJob.id : 'none'}`);
    }
  };

  /**
   * FR: Vérification et initialisation des statuts des jobs
   * EN: Check and initialize job statuses
   */
  useEffect(() => {
    const idsLength = manualJobIds.length;
    const jobStatusesLength = Object.keys(manualJobStatuses).length;
    if (jobStatusesLength < idsLength) {
      logger.info(`Job statuses count (${jobStatusesLength}) is less than job IDs count (${idsLength}). Initializing missing statuses...`);
      initJobStatuses();
    }
  }, [manualJobIds])

  /**
   * FR: Démarage du traitement si le mode auto est désactiver et que isStartedWorkflows est activé
   * EN: Start processing if auto mode is disabled and isStartedWorkflows is activated
   */
  useEffect(()=>{
    if (isStartedWorkflows && !autoMode && !start) {
      logger.info(`Starting manual job processing...`);
      setStart(true);
    }
  }, [isStartedWorkflows, autoMode])

  /**
   * FR: Lance l'exécution du traitement par IA de manière séquenciel
   * EN: Starts the AI processing execution sequentially
   */
  useEffect(() => {

    // Initialization progression
    if (start) {
      const isInitNotStarted = Object.values(manualJobStatuses).some(status => status.initialized === null);
      // Trigger initialization processing
      if (isInitNotStarted) {
        logger.info(`Triggering initialization processing...`);
        nextInitProcessing();
      }
    }

    // Data processing progression
    if (start) {
      const isDataProcessing = Object.values(manualJobStatuses).some(status => status.data_status === 'processing');
      // Trigger data processing
      if (!isDataProcessing) {
        logger.info(`Triggering data processing...`);
        nextDataProcessing();
      }
    }

    // AI processing progression
    if (start && Object.values(manualJobStatuses).every(status => status.data_status !== null && status.data_status !== 'processing')) {
      const isAiProcessing = Object.values(manualJobStatuses).some(status => status.ai_status === 'processing');
      // Trigger AI processing
      if (!isAiProcessing) {
        logger.info(`Triggering AI processing...`);
        nextAiProcessing();
      }
    }

    // Started without ids
    if (start && manualJobIds.length === 0) {
      dispatch(setFranceTravailStatus('success'));
      logger.info(`No job IDs to process. Marking as successful.`);
    }

    // Check if all processed are finished
    if (start && manualJobIds.length > 0) {
      if (JobStatusesChecker.isSuccessful(manualJobStatuses)) {
        dispatch(setFranceTravailStatus('success'));
        logger.info(`All jobs processed successfully.`);
      }
      else if (JobStatusesChecker.isFailed(manualJobStatuses)) {
        dispatch(setFranceTravailStatus('error'));
        logger.info(`Some jobs failed.`);
      }
    }

  }, [start, manualJobIds, manualJobStatuses])

  /**
   * FR: Rendu du formulaire d'ajout d'un ou plusieurs id et de sa liste
   * EN: Renders the form for adding one or more IDs and its list
   */
  const hiddenClass = isStartedWorkflows && autoMode ? 'hidden' : '';
  return (
    <div className={`flex flex-col gap-2 ${hiddenClass}`}>
      <h2 className="text-lg font-medium bg-gray-100 p-2 rounded-lg dark:bg-neutral-800">
        France Travail
      </h2>

      {/* Form add job ids */}
      <div className={`w-full`}>
        <form onSubmit={handleAddJobId}>
        <input
          type="text"
          className={`
            p-2
            bg-gray-50 border
            border-gray-300
            text-gray-900
            text-sm
            rounded-l-lg
            focus:ring-blue-500 focus:border-blue-500
            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
          `}
          placeholder="Enter job ID"
          value={newJobIds}
          onChange={(e) => setNewJobIds(e.target.value)}
        />

        <div className="inline-flex rounded-md shadow-xs" role="group">

          {/* Add job id button */}
          <button
            type="submit"
            className={`
              inline-flex
              items-center
              px-4 py-2
              text-sm font-medium text-white
              bg-blue-500
              hover:text-white hover:bg-blue-600
              border-t border-b border-gray-200
              focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700
              dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white
            `}
          >
            &nbsp;
            <CirclePlus size={18} />
            &nbsp;
          </button>

          {/* Start processing button */}
          <button
            type="button"
            className={`
              inline-flex
              items-center
              px-4 py-2
              text-sm font-medium text-white
              bg-green-500
              border border-gray-200
              rounded-e-lg
              hover:bg-green-600 hover:text-white
              focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700
              dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white
              ${start ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={start || manualJobIds.length === 0}
            onClick={async () => {
              setStart(true);
            }}
          >
            &nbsp;
            <CirclePlay size={18} />
            &nbsp;
          </button>
        </div>


        </form>
      </div>

    {/* Job card list with status and remove button if processing not started */}
      <div className="flex flex-wrap gap-2">
        {manualJobIds.map((id) => (
          <div key={id} className="relative border border-gray-300 dark:border-gray-600 rounded-md p-4 w-[248px]">
            <h3 className="flex items-center gap-1 font-medium text-gray-800 dark:text-gray-200">
              <ReceiptText size={20} />
              {id}
            </h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="pt-2 pb-1 text-sm text-gray-600 dark:text-gray-400 w-1/4">
                    <span title="Initialization">
                      <PackagePlus size={18} />
                    </span>
                  </th>
                  <th className="pt-2 pb-1 text-sm text-gray-600 dark:text-gray-400 w-1/4">
                    <span title="Data Processing">
                      <Database size={18} />
                    </span>
                  </th>
                  <th className="text-sm text-gray-600 dark:text-gray-400 w-1/4">
                    <span title="AI Processing">
                      <Cpu size={18} />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-sm text-gray-600">
                    <N8NWorkflowFranceTravailJobInitProcessing
                      jobId={id}
                      start={start && jobIdInitProcessing === id}
                      onUpdate={(status, outdated) => handleUpdateJobInitStatus(id, status, outdated)}
                    />
                  </td>
                  <td className="text-sm text-gray-600">
                      <N8NWorkflowFranceTravailJobDataProcessing
                      jobId={id}
                      initialStatus={manualJobStatuses[id] ? manualJobStatuses[id].data_status : null}
                      start={start && jobIdDataProcessing === id}
                      onUpdate={(status) => handleUpdateJobDataStatus(id, status)}
                    />
                  </td>
                  <td className="text-sm text-gray-600">
                    {(manualJobStatuses[id] && (manualJobStatuses[id].data_status === 'skipped' || manualJobStatuses[id].data_status === 'error'))
                      ? <span title={'Skipped'}><JobWorkflowStatusIcon status={'skipped'} /></span>
                      : <N8NWorkflowFranceTravailJobAIProcessing
                          jobId={id}
                          initialStatus={manualJobStatuses[id] ? manualJobStatuses[id].ai_status : null}
                          start={start && jobIdAiProcessing === id}
                          onUpdate={(status) => handleUpdateJobAIStatus(id, status)}
                        />
                    }
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Outdated icon */}
            <div className={`absolute right-1 top-1 rounded-full`}>
              {manualJobStatuses[id] && manualJobStatuses[id].outdated === true && <span title={'Outdated'}><CalendarOff size={16} className="text-red-500" /></span>}
              {manualJobStatuses[id] && manualJobStatuses[id].outdated === false && <span title={'Up to date'}><Calendar size={16} className="text-green-500" /></span>}
            </div>

            {/* Remove job button */}
            <button
              onClick={() => handleRemoveJobId(id)}
              className={`absolute right-1 top-1 rounded-full ${start ? 'hidden' : 'text-red-600 hover:text-red-50 hover:bg-red-600'}`}
              disabled={start}
            >
              <CircleX size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}