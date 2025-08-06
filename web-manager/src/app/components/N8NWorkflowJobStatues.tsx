'use client';

import { IJobStatus } from "../interfaces/IJobStatus";
import TruncatedText from "./TruncatedText";

interface N8NWorkflowJobStatuesProps {
  jobStatuses: Record<string, IJobStatus>;
}

export default function N8NWorkflowJobStatues ({ jobStatuses }: N8NWorkflowJobStatuesProps) {
  return (
    <div className="flex flex-col gap-2">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-lef w-[150px]">Job ID</th>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left w-[200px]">Created At</th>
            <th className="px-4 py-2 text-left w-[100px]">Status</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(jobStatuses).map((job) => (
            <tr key={job.id}>
              <td className="border px-4 py-2">{job.id}</td>
              <td className="border px-4 py-2"><TruncatedText text={job.title || "Unknown Title"} length={55} /></td>
              <td className="border px-4 py-2">{job.createdAt?.toLocaleString()}</td>
              <td className={`border px-4 py-2 ${job.status === 'initialized' ? 'text-gray-500' : job.status === 'data_processing' ? 'text-blue-500' : job.status === 'data_ok' ? 'text-green-500' : job.status === 'data_error' ? 'text-red-500' : job.status === 'ai_processing' ? 'text-yellow-500' : job.status === 'ai_ok' ? 'text-green-600' : job.status === 'ai_error' ? 'text-red-600' : ''}`}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}