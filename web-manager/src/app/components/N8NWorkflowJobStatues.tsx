'use client';

import { CalendarOff } from "lucide-react";
import { IJobStatus } from "../interfaces/IJobStatus";
import TruncatedText from "./TruncatedText";
import JobWorkflowStatusIcon from "./Icon/JobWorkflowStatusIcon";

interface N8NWorkflowJobStatuesProps {
  jobStatuses: Record<string, IJobStatus>;
  target: string | null;
}

export default function N8NWorkflowJobStatues ({ jobStatuses, target }: N8NWorkflowJobStatuesProps) {
  return (
    <div className="flex flex-col gap-2">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-lef w-[220px]">Job ID</th>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left w-[160px]">Created At</th>
            <th className="px-4 py-2 text-left w-[50px]">Data</th>
            <th className="px-4 py-2 text-left w-[50px]">AI</th>
            <th className="px-4 py-2 text-left w-[50px]" title="Outdated"><CalendarOff size={16} /></th>
          </tr>
        </thead>
        <tbody>
          {Object.values(jobStatuses).map((job) => (
            <tr key={job.id} className={`${target === job.id ? 'bg-blue-50' : ''}`}>
              <td className="border px-4 py-2">
                {job.id}
              </td>
              <td className="border px-4 py-2">
                <TruncatedText text={job.title || "Unknown Title"} length={80} />
              </td>
              <td className="border px-4 py-2">
                {job.createdAt?.toLocaleString()}
              </td>
              <td className={`border px-4 py-2`}>
                <JobWorkflowStatusIcon status={job.data_status} />
              </td>
              <td className={`border px-4 py-2`}>
                <JobWorkflowStatusIcon status={job.ai_status} />
              </td>
              <td className={`border px-4 py-2 justify-center justify-items-center text-center`}>
                <span className={`${job.outdated ? 'text-red-500' : ''}`} >
                  {job.outdated 
                    ? <span title={'Outdated'}><CalendarOff size={16} /></span>
                    : ''
                  }
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}