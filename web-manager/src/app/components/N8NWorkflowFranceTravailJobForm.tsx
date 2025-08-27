'use client';

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { Barcode, CalendarOff, CircleDashed, CircleDotDashed, CirclePause, CircleX, Cpu, Database, Delete, MessageCircleDashed, Pause, ReceiptText, ShieldPlus } from "lucide-react";

export default function N8NWorkflowFranceTravailJobForm() {
  const dispatch = useAppDispatch()
  const { isStartedWorkflows } = useAppSelector(state => state.n8nReducer)

  // Initialized job form states
  const [newJobIds, setNewJobIds] = useState<string>('');
  const [jobIds, setJobIds] = useState<string[]>([]);

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
            value={newJobIds}
            onChange={(e) => setNewJobIds(e.target.value)}
            placeholder="Enter job ID"
            className="border border-gray-300 dark:bg-neutral-200 dark:text-neutral-800 rounded-l-lg py-1 px-2"
          />
          <button
            type="submit"
            className="bg-blue-500 border border-blue-500 text-white rounded-r-lg py-1 px-2"
          >
            Add
          </button>
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
                    <CalendarOff size={18} />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-sm text-gray-600">
                    {/* TODO: Add data content */}
                    <CircleDotDashed size={18} className="text-gray-300 dark:text-gray-600" />
                  </td>
                  <td className="text-sm text-gray-600">
                    {/* TODO: Add AI content */}
                    <CircleDotDashed size={18} className="text-gray-300 dark:text-gray-600" />
                  </td>
                  <td className="text-sm text-gray-600">
                    {/* TODO: Add outdated content */}
                    <CircleDotDashed size={18} className="text-gray-300 dark:text-gray-600" />
                  </td>
                </tr>
              </tbody>
            </table>

            <button
              onClick={() => setJobIds(jobIds.filter(jobId => jobId !== id))}
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