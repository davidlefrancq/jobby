'use client';

import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import TruncatedText from './TruncatedText';
// import { useAppDispatch } from '../store';
import { ICvEntity } from '@/types/ICvEntity';
import { useAppDispatch } from '../store';
import { removeCv, setSelectedCvId } from "../store/cvsReducer";
import { addAlert } from "../store/alertsReducer";
import { RepositoryFactory } from '../dal/RepositoryFactory';

const cvRepository = RepositoryFactory.getInstance().getCvRepository();

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

  const handleRemove = async (cv: ICvEntity) => {
    if (!cv || !cv._id) console.error("CV not found.");
    else {
      if (!window.confirm(`Are you sure to remove CV "${cv.title}"?`)) return;
      try {
        const isRemoved = await cvRepository.remove(cv._id.toString());
        if (isRemoved) dispatch(removeCv(cv._id.toString()));
      } catch (err) {
        dispatch(addAlert({
          date: new Date().toISOString(),
          message: `Error removing CV: ${err instanceof Error ? err.message : String(err)}`,
          type: "error"
        }));
      }
    }
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
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedCvs.map((cv, key) => (
            <tr key={key} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800" onClick={() => dispatch(setSelectedCvId(cv._id?.toString() || null))} style={{ cursor: 'pointer' }}>
                {cv.createdAt ? new Date(cv.createdAt).toLocaleDateString() : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800" onClick={() => dispatch(setSelectedCvId(cv._id?.toString() || null))} style={{ cursor: 'pointer' }}>
                {<TruncatedText text={cv.title || ''} length={72} />}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800" onClick={() => dispatch(setSelectedCvId(cv._id?.toString() || null))} style={{ cursor: 'pointer' }}>
                <TruncatedText text={cv.city || ''} length={20} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                <div className="flex space-x-2">
                  <button
                    className="text-gray-500 hover:text-red-600 transition group cursor-pointer caret-transparent"
                    onClick={(e) => { e.stopPropagation(); handleRemove(cv); }}
                    title="Remove"
                  >
                    <div className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center group-hover:border-red-400">
                      <span className="text-xs mb-0.5 group-hover:text-red-600">
                        <Trash2 size={18} />
                      </span>
                    </div>
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