'use client';

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { CalendarOff, CirclePlay, CirclePlus, CircleX, Cpu, Database, ReceiptText } from "lucide-react";
import { IJobStatus } from "../interfaces/IJobStatus";
import JobWorkflowStatusIcon from "./Icon/JobWorkflowStatusIcon";
import N8NWorkflowFranceTravailJobDataProcessing from "./N8NWorkflowFranceTravailJobDataProcessing";
import N8NWorkflowFranceTravailJobAIProcessing from "./N8NWorkflowFranceTravailJobAIProcessing";

export default function N8NWorkflowFranceTravailJobForm() {
  const dispatch = useAppDispatch()
  const { isStartedWorkflows } = useAppSelector(state => state.n8nReducer)

  // Initialized job form states
  const [newJobIds, setNewJobIds] = useState<string>('');
  const [jobIds, setJobIds] = useState<string[]>([]);
  const [jobStatuses, setJobStatuses] = useState<Record<string, IJobStatus>>({});
  const [start, setStart] = useState<boolean>(false);
  const [jobIdAiProcessing, setJobIdAiProcessing] = useState<string | null>(null);

  /**
   * FR: Initialisation des statuts des jobs
   * EN: Initialize job statuses
   */
  const initJobStatuses = () => {
    // Initialize new job statuses
    const newStatuses: Record<string, IJobStatus> = {};
    for (const id of jobIds) {
      if (!jobStatuses[id]) {
        newStatuses[id] = { id, title: '', createdAt: new Date(), initialized: false, outdated: false, data_status: null, ai_status: null };
      }
    }
    // Add new job statuses
    setJobStatuses(prev => ({ ...prev, ...newStatuses }));
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
    const idsWithoutNews: string[] = jobIds.filter(id => !uniqueIds.includes(id));
    // Update
    const newIdList = [...idsWithoutNews, ...uniqueIds].sort((a, b) => a.localeCompare(b));
    setJobIds(newIdList);
    setNewJobIds('');
  };

  const handleUpdateJobDataStatus = (id: string, status: IJobStatus['data_status']) => {
    if (!jobStatuses[id] || jobStatuses[id].data_status === status) return;
    const newJobStatuses = { ...jobStatuses };
    newJobStatuses[id].data_status = status;
    setJobStatuses(newJobStatuses);
  }

  const handleUpdateJobAIStatus = (id: string, status: IJobStatus['ai_status']) => {
    if (!jobStatuses[id] || jobStatuses[id].ai_status === status) return;
    const newJobStatuses = { ...jobStatuses };
    newJobStatuses[id].ai_status = status;
    setJobStatuses(newJobStatuses);
  };

  const handleRemoveJobId = (id: string) => {
    const newJobIds = jobIds.filter(jobId => jobId !== id);
    setJobIds(newJobIds);

    const newJobStatuses = { ...jobStatuses };
    delete newJobStatuses[id];
    setJobStatuses(newJobStatuses);
  }

  const nextAiProcessing = async () => {
    if (jobStatuses) {
      const nextJob = Object.values(jobStatuses).find(job => job.ai_status === null && job.data_status === 'ok');
      if (nextJob) {
        setJobIdAiProcessing(nextJob.id);
      } else {
        setJobIdAiProcessing(null);
      }
    }
  };

  /**
   * FR: Vérification et initialisation des statuts des jobs
   * EN: Check and initialize job statuses
   */
  useEffect(() => {
    const idsLength = jobIds.length;
    const jobStatusesLength = Object.keys(jobStatuses).length;
    if (jobStatusesLength < idsLength) {
      initJobStatuses();
    }
  }, [jobIds])

  /**
   * FR: Lance l'exécution du traitement par IA de manière séquenciel
   * EN: Starts the AI processing execution sequentially
   */
  useEffect(() => {
    // if start and all data processing finished
    if (start && Object.values(jobStatuses).every(status => status.data_status !== null && status.data_status !== 'processing')) {
      // if not in ai processing
      const isAiProcessing = Object.values(jobStatuses).some(status => status.ai_status === 'processing');
      // TODO: Trigger AI processing
      if (!isAiProcessing) {
        nextAiProcessing();
      }
    }
  }, [start, jobStatuses])

  /**
   * FR: Rendu du formulaire d'ajout d'un ou plusieurs id et de sa liste
   * EN: Renders the form for adding one or more IDs and its list
   */
  const hiddenClass = isStartedWorkflows ? 'hidden' : '';
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
            disabled={start || jobIds.length === 0}
            onClick={async () => {
              setStart(true);
              // await dataListProcessing();
              // setStart(false);
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
        {jobIds.map((id) => (
          <div key={id} className="relative border border-gray-300 dark:border-gray-600 rounded-md p-4 w-[248px]">
            <h3 className="flex items-center gap-1 font-medium text-gray-800 dark:text-gray-200">
              <ReceiptText size={20} />
              {id}
            </h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="pt-2 pb-1 text-sm text-gray-600 dark:text-gray-400 w-1/2">
                    <Database size={18} />
                  </th>
                  <th className="text-sm text-gray-600 dark:text-gray-400 w-1/2">
                    <Cpu size={18} />
                  </th>
                  <th className="text-sm text-gray-600 dark:text-gray-400 w-1/2">
                    {/* Outdated column */}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-sm text-gray-600">
                    <N8NWorkflowFranceTravailJobDataProcessing
                    jobId={id}
                    start={start}
                    onUpdate={(status) => handleUpdateJobDataStatus(id, status)}
                  />
                  </td>
                  <td className="text-sm text-gray-600">
                    {(jobStatuses[id] && jobStatuses[id].data_status !== 'ok')
                      ? <span title={'Skipped'}><JobWorkflowStatusIcon status={'skipped'} /></span>
                      : <N8NWorkflowFranceTravailJobAIProcessing
                          jobId={id}
                          start={start && jobIdAiProcessing === id}
                          onUpdate={(status) => handleUpdateJobAIStatus(id, status)}
                        />
                    }
                  </td>
                  <td className="text-sm text-gray-600">
                    {jobStatuses[id] && jobStatuses[id].outdated
                      && <span title={'Outdated'}><CalendarOff size={16} /></span>
                    }
                  </td>
                </tr>
              </tbody>
            </table>

            <button
              onClick={() => handleRemoveJobId(id)}
              className="absolute right-1 top-1 text-red-600 hover:text-red-50 hover:bg-red-600 rounded-full"
            >
              {/* <Delete size={20} /> */}
              <CircleX size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}