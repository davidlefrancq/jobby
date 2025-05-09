'use client';

import { IJob } from '@/models/IJob';
import { useState } from 'react';

interface JobViewProps {
  job: IJob;
  onDeleted?: () => void;
  onCancel?: () => void;
  onEdit?: (job: IJob) => void;
}

/**
 * Component to display detailed view of a single Job.
 * Supports single-page edit via onEdit callback.
 */
export default function JobView({ job, onCancel, onDeleted, onEdit }: JobViewProps) {
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  /**
   * Handles deletion of the job via API.
   */
  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this job?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/jobs/${job._id.toString()}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (onDeleted) onDeleted();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setDeleting(false);
    }
  }

  /**
   * Triggers single-page edit via callback.
   */
  function handleEdit() {
    if (onEdit) onEdit(job);
  }

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">{job.title}</h2>
      <p className="mb-2"><strong>Company:</strong> {job.company}</p>
      <p className="mb-2"><strong>Location:</strong> {job.location}</p>
      <p className="mb-2"><strong>Contract:</strong> {job.contract_type || 'N/A'}</p>
      <p className="mb-2"><strong>Date:</strong> {job.date}</p>
      <p className="mb-4"><strong>Description:</strong> {job.description}</p>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <p><strong>Interest Indicator:</strong> {job.interest_indicator}</p>
          <p><strong>Level:</strong> {job.level || 'N/A'}</p>
          <p><strong>Methodology:</strong> {job.methodology.join(', ')}</p>
        </div>
        <div>
          <p><strong>Salary:</strong> {job.salary.min} - {job.salary.max} {job.salary.currency}</p>
          <p><strong>Source:</strong> {job.source}</p>
          <p><strong>Teleworking:</strong> {job.teleworking ? 'Yes' : 'No'}</p>
        </div>
      </div>

      {error && <p className="text-red-600 mb-2">Error: {error}</p>}

      <div className="flex space-x-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
          Cancel
        </button>
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
