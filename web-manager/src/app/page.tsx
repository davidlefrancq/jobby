'use client';

import { useState } from 'react';
import JobView from '@/app/components/JobView';
import JobEdit from '@/app/components/JobEdit';
import JobBoard from './components/JobBoard';
import { IJobEntity } from '@/types/IJobEntity';

export default function HomePage() {
  const [viewing, setViewing] = useState<IJobEntity | null>(null);
  const [editing, setEditing] = useState<IJobEntity | null>(null);
  const [creating, setCreating] = useState(false);
  const [prevViewing, setPrevViewing] = useState<IJobEntity | null>(null);

  const handleView = (job: IJobEntity) => {
    setViewing(job); setEditing(null); setCreating(false);
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

  return (
    <div className="container mx-auto p-6">
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
