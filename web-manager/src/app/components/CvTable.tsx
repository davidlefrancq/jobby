'use client';

import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import TruncatedText from './TruncatedText';
// import { useAppDispatch } from '../store';
import { ICvEntity } from '@/types/ICvEntity';
import { removeCv, setCvs, setCvsCounter, setCvsSkip, setSelectedCvId, updateCv } from "../store/cvsReducer";
import { useAppDispatch } from '../store';

interface CvTableProps {
  cvs: ICvEntity[];
}

type SortKey = keyof Pick<ICvEntity, 'title' | 'city' | 'createdAt' | 'updatedAt'>;
type SortConfig = {
  key: SortKey;
  direction: 'asc' | 'desc';
};
const initialSortConfig: SortConfig = { key: 'createdAt', direction: 'desc' };

export default function CvTable({ cvs }: CvTableProps) {
  const dispatch = useAppDispatch();

  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>(initialSortConfig);

  const sortedCvs = useMemo(() => {
    if (!sortConfig) return cvs;
    return [...cvs].sort((a, b) => {
      const aVal = a[sortConfig.key] ?? '';
      const bVal = b[sortConfig.key] ?? '';
      const aStr = typeof aVal === 'string' ? aVal.toLowerCase() : aVal;
      const bStr = typeof bVal === 'string' ? bVal.toLowerCase() : bVal;
      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [cvs, sortConfig]);

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
    <div className="overflow-x-auto mt-0">
      <table className="table-fixed w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="w-28 px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide cursor-pointer" onClick={() => handleSort('createdAt')}>
              Date {renderSortIcon('createdAt')}
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide cursor-pointer" onClick={() => handleSort('title')}>
              Title {renderSortIcon('title')}
            </th>
            <th className="w-48 px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide cursor-pointer" onClick={() => handleSort('city')}>
              City {renderSortIcon('city')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedCvs.map((cv, key) => (
            <tr key={key} className="hover:bg-gray-50" onClick={() => dispatch(setSelectedCvId(cv._id?.toString()))} style={{ cursor: 'pointer' }}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                {cv.createdAt ? new Date(cv.createdAt).toLocaleDateString() : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                {<TruncatedText text={cv.title || ''} length={72} />}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                <TruncatedText text={cv.city || ''} length={20} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}