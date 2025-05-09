'use client';

import { useEffect, useState } from 'react';
import JobTable from '@/app/components/JobTable';
import JobView from '@/app/components/JobView';
import JobCreate from '@/app/components/JobCreate';
import { IJob } from '@/models/IJob';

/**
 * Single-page application component for jobs management with cancel support.
 */
export default function HomePage() {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewing, setViewing] = useState<IJob | null>(null);
  const [editing, setEditing] = useState<IJob | null>(null);
  const [creating, setCreating] = useState(false);
  const [prevViewing, setPrevViewing] = useState<IJob | null>(null);

  // Load jobs list
  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/jobs');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setJobs(await res.json());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // Handlers
  const handleView = (job: IJob) => {
    setViewing(job);
    setEditing(null);
    setCreating(false);
  };

  const handleEditFromTable = (job: IJob) => {
    setPrevViewing(null);
    setEditing(job);
    setViewing(null);
    setCreating(false);
  };

  const handleEditFromView = (job: IJob) => {
    setPrevViewing(job);
    setEditing(job);
    setViewing(null);
    setCreating(false);
  };

  const handleDelete = () => {
    setViewing(null);
    loadJobs();
  };

  const handleCreated = () => {
    setCreating(false);
    loadJobs();
  };

  // Cancel callbacks
  const cancelCreate = () => {
    setCreating(false);
  };

  const cancelEditFromTable = () => {
    setEditing(null);
  };

  const cancelEditFromView = () => {
    if (prevViewing) {
      setEditing(null);
      setViewing(prevViewing);
      setPrevViewing(null);
    }
  };

  const cancelView = () => {
    setViewing(null);
    setEditing(null);
    setCreating(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Job Offers</h1>

      {/* Show create button when no action */}
      {!viewing && !editing && !creating && (
        <button
          onClick={() => setCreating(true)}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Create New Job
        </button>
      )}

      {/* Create form */}
      {creating && (
        <JobCreate onCreated={handleCreated} onCancel={cancelCreate} />
      )}

      {/* Edit form from table */}
      {editing && prevViewing === null && (
        <JobCreate
          onCreated={() => { cancelEditFromTable(); loadJobs(); }}
          onCancel={cancelEditFromTable}
          job={editing}
        />
      )}

      {/* Edit form from view */}
      {editing && prevViewing && (
        <JobCreate
          onCreated={() => { cancelEditFromView(); loadJobs(); }}
          onCancel={cancelEditFromView}
          job={editing}
        />
      )}

      {/* Detail view */}
      {viewing && !editing && !creating && (
        <JobView
          job={viewing}
          onDeleted={handleDelete}
          onCancel={cancelView}
          onEdit={handleEditFromView}
        />
      )}

      {/* Table list */}
      {!viewing && !editing && !creating && (
        <JobTable jobs={jobs} onView={handleView} onEdit={handleEditFromTable} />
      )}
    </div>
  );
}
