'use client';

import { IJob } from '@/models/IJob';
import React from 'react';

interface JobTableProps {
  jobs: IJob[];
  onView: (job: IJob) => void;
  onEdit: (job: IJob) => void;
}

/**
 * Component to display a table of jobs with view and edit callbacks.
 */
export default function JobTable({ jobs, onView, onEdit }: JobTableProps) {
  return (
    <table className="min-w-full bg-white shadow rounded">
      <thead>
        <tr>
          <th className="px-4 py-2">Title</th>
          <th className="px-4 py-2">Company</th>
          <th className="px-4 py-2">Location</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job) => (
          <tr key={job._id.toString()} className="border-t">
            <td className="px-4 py-2">{job.title}</td>
            <td className="px-4 py-2">{job.company}</td>
            <td className="px-4 py-2">{job.location}</td>
            <td className="px-4 py-2 space-x-2">
              <button
                onClick={() => onView(job)}
                className="text-blue-600 hover:underline"
              >
                View
              </button>
              <button
                onClick={() => onEdit(job)}
                className="text-green-600 hover:underline"
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
