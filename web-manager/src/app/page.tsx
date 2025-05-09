'use client';

import { useEffect, useState } from 'react';
import JobTable from '@/app/components/JobTable';
import JobView from '@/app/components/JobView';
import JobEdit from '@/app/components/JobEdit';
import JobBoard from './components/JobBoard';
import { IJobEntity } from '@/types/IJobEntity';

export default function HomePage() {
  const [error, setError] = useState<string | null>(null);
  const [viewing, setViewing] = useState<IJobEntity | null>(null);
  const [editing, setEditing] = useState<IJobEntity | null>(null);
  const [creating, setCreating] = useState(false);
  const [prevViewing, setPrevViewing] = useState<IJobEntity | null>(null);

  const handleView = (job: IJobEntity) => {
    setViewing(job); setEditing(null); setCreating(false);
  };
  const handleEditFromTable = (job: IJobEntity) => {
    setPrevViewing(null); setEditing(job); setViewing(null); setCreating(false);
  };
  const handleEditFromView = (job: IJobEntity) => {
    setPrevViewing(job); setEditing(job); setViewing(null); setCreating(false);
  };
  const handleDelete = () => { setViewing(null); };
  const handleCreated = () => { setCreating(false); };
  const cancelCreate = () => setCreating(false);
  const cancelEditFromTable = () => setEditing(null);
  const cancelEditFromView = () => {
    if (prevViewing) {
      setEditing(null);
      setViewing(prevViewing);
      setPrevViewing(null);
    }
  };
  const cancelView = () => { setViewing(null); setEditing(null); setCreating(false); };

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-xl text-red-600">Error: {error}</span>
      </div>
    );

  return (
    <div className="container mx-auto p-6">
      {/* <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 sm:mb-0">
          Jobs
        </h1>
        {!viewing && !editing && !creating && (
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
          >
            Add
          </button>
        )}
      </header> */}

      <section className="space-y-6">
        {creating && (
          <div className="bg-white p-6">
            <JobEdit onCreated={handleCreated} onCancel={cancelCreate} />
          </div>
        )}

        {editing && prevViewing === null && (
          <div className="bg-white p-6">
            <JobEdit
              onCreated={() => { cancelEditFromTable(); }}
              onCancel={cancelEditFromTable}
              job={editing}
            />
          </div>
        )}

        {editing && prevViewing && (
          <div className="bg-white p-6">
            <JobEdit
              onCreated={() => { cancelEditFromView(); }}
              onCancel={cancelEditFromView}
              job={editing}
            />
          </div>
        )}

        {viewing && !editing && !creating && (
          <div className="bg-white p-6">
            <JobView
              job={viewing}
              onDeleted={handleDelete}
              onCancel={cancelView}
              onEdit={handleEditFromView}
            />
          </div>
        )}

        {!viewing && !editing && !creating && (
          <div className="overflow-x-auto rounded-lg">
            <JobBoard onView={handleView} />
            {/* <JobTable jobs={jobs} onView={handleView} onEdit={handleEditFromTable} /> */}
          </div>
        )}
      </section>
    </div>
  );
}
