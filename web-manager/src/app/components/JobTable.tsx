'use client';

import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { IJobEntity } from '@/types/IJobEntity';
import TruncatedText from './TruncatedText';
import SalaryItem from './SalaryItem';
import JobStatus from './JobStatus';
import Link from 'next/link';
import LanguageFlag from './LanguageFlag';

interface JobTableProps {
  jobs: IJobEntity[];
  onView: (job: IJobEntity) => void;
}

type SortKey = keyof Pick<IJobEntity, 'original_job_id' | 'date' | 'location' | 'title' | 'company' | 'contract_type'>;
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

  const getSourceName = (job: IJobEntity) => {
    const data = new URL(job.source).hostname.split('.');
    return data[data.length - 2] || 'N/A';
  }

  return (
    <div className="overflow-x-auto mt-0">
      <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide cursor-pointer" onClick={() => handleSort('date')}>
              Date {renderSortIcon('date')}
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide cursor-pointer" onClick={() => handleSort('original_job_id')}>
              Source {renderSortIcon('original_job_id')}
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide cursor-pointer">
              {/* Language */}
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide cursor-pointer" onClick={() => handleSort('location')}>
              Localisation {renderSortIcon('location')}
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide cursor-pointer" onClick={() => handleSort('title')}>
              Title {renderSortIcon('title')}
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide cursor-pointer" onClick={() => handleSort('company')}>
              Company {renderSortIcon('company')}
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide cursor-pointer" onClick={() => handleSort('contract_type')}>
              Type {renderSortIcon('contract_type')}
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide">Salary</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide">Indicator</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedJobs.map((job) => (
            <tr key={job._id.toString()} className="hover:bg-gray-50" onClick={() => onView(job)}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                {job.date ? new Date(job.date).toLocaleDateString() : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800" onClick={(e) => e.stopPropagation()}>
                {job.original_job_id
                  ? <Link href={job.source} target={'_blank'} className="text-blue-500 hover:underline">
                      {/* {job.original_job_id } */}
                      {getSourceName(job)}
                    </Link>
                  : 'N/A'
                }
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                <LanguageFlag language={job.language || ''} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                <TruncatedText text={job.location || ''} length={20} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                <TruncatedText text={job.title || ''} length={40} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                <TruncatedText text={job.company || ''} length={20} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                <TruncatedText text={job.contract_type || ''} length={10} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                <SalaryItem salary={job.salary} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                <JobStatus job={job} showLegend={true} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}