'use client';

import { IJob } from '@/models/IJob';
import React from 'react';

interface JobTableProps {
  jobs: IJob[];
  onView: (job: IJob) => void;
  onEdit: (job: IJob) => void;
}

export default function JobTable({ jobs, onView, onEdit }: JobTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide">Title</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide">Entreprise</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide">Localisation</th>
            <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {jobs.map((job) => (
            <tr key={job._id.toString()} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{job.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{job.company}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{job.location}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => onView(job)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEdit(job)}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition"
                  >
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}