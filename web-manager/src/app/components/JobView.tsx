'use client';

import { IJobEntity } from '@/types/IJobEntity';
import { useState } from 'react';

interface JobViewProps {
  job: IJobEntity;
  onDeleted: () => void;
  onCancel: () => void;
  onEdit: (job: IJobEntity) => void;
}

export default function JobView({ job, onCancel, onDeleted, onEdit }: JobViewProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Confirmer la suppression de cette offre ?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/jobs/${job._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      onDeleted();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-gray-800 mb-6">{job.title}</h1>
      <p className="text-gray-600 mb-2"><span className="font-semibold">Entreprise :</span> {job.company}</p>
      <p className="text-gray-600 mb-4"><span className="font-semibold">Localisation :</span> {job.location}</p>
      <div className="mt-4">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Description</h3>
        <p className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">{job.description || 'Aucune description fournie.'}</p>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => onEdit(job)}
          className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-5 py-2 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 disabled:opacity-50 transition"
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg shadow hover:bg-gray-300 transition"
        >
          Return
        </button>
      </div>
    </>
  );
}
