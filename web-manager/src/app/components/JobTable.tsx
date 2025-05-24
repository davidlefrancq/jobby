'use client';

import { IJobEntity } from '@/types/IJobEntity';
import React from 'react';
import TruncatedText from './TruncatedText';
import SalaryItem from './SalaryItem';

interface JobTableProps {
  jobs: IJobEntity[];
  onView: (job: IJobEntity) => void;
}

export default function JobTable({ jobs, onView }: JobTableProps) {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide">Date</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide">Localisation</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide">Title</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide">Entreprise</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide">Type</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide">Salary</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {jobs.map((job) => (
            <tr key={job._id.toString()} className="hover:bg-gray-50" onClick={() => onView(job)}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{job.date ? new Date(job.date).toLocaleDateString() : 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{job.location}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{job.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{job.company}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{<TruncatedText text={job.contract_type || ''} length={10} />}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"><SalaryItem salary={job.salary} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}