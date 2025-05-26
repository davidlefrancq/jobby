'use client';

import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { IJobEntity } from '@/types/IJobEntity';
import TruncatedText from './TruncatedText';
import SalaryItem from './SalaryItem';

interface JobTableProps {
  jobs: IJobEntity[];
  onView: (job: IJobEntity) => void;
}

type SortKey = keyof Pick<IJobEntity, 'date' | 'location' | 'title' | 'company' | 'contract_type'>;
type SortConfig = {
  key: SortKey;
  direction: 'asc' | 'desc';
};
const initialSortConfig: SortConfig = { key: 'date', direction: 'desc' };

export default function JobTable({ jobs, onView }: JobTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>(initialSortConfig);

  const sortedJobs = useMemo(() => {
    if (!sortConfig) return jobs;
    return [...jobs].sort((a, b) => {
      const aVal = a[sortConfig.key] ?? '';
      const bVal = b[sortConfig.key] ?? '';
      const aStr = typeof aVal === 'string' ? aVal.toLowerCase() : aVal;
      const bStr = typeof bVal === 'string' ? bVal.toLowerCase() : bVal;
      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [jobs, sortConfig]);

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );
  };

  const renderSortIcon = (key: SortKey) => {
    if (sortConfig?.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ArrowUp className="inline w-4 h-4 ml-1" /> : <ArrowDown className="inline w-4 h-4 ml-1" />;
  };

  return (
    <div className="overflow-x-auto mt-4">
      <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide cursor-pointer" onClick={() => handleSort('date')}>
              Date {renderSortIcon('date')}
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide cursor-pointer" onClick={() => handleSort('location')}>
              Localisation {renderSortIcon('location')}
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide cursor-pointer" onClick={() => handleSort('title')}>
              Title {renderSortIcon('title')}
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide cursor-pointer" onClick={() => handleSort('company')}>
              Entreprise {renderSortIcon('company')}
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide cursor-pointer" onClick={() => handleSort('contract_type')}>
              Type {renderSortIcon('contract_type')}
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide">Salary</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedJobs.map((job) => (
            <tr key={job._id.toString()} className="hover:bg-gray-50" onClick={() => onView(job)}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{job.date ? new Date(job.date).toLocaleDateString() : 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{job.location}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{job.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{job.company}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                <TruncatedText text={job.contract_type || ''} length={10} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                <SalaryItem salary={job.salary} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}