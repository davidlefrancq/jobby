import { IJobEntity } from "@/types/IJobEntity";
import { useState } from "react";
import { RepositoryFactory } from "../dal/RepositoryFactory";
import { useAppDispatch } from "../store";
import { updateLikedJob } from "../store/jobsReducer";

const jobRepository = RepositoryFactory.getInstance().getJobRepository();

interface JobMotivationEmailPanelProps {
  job: IJobEntity;
  onClose?: () => void;
}

export default function JobMotivationEmailPanel({ job, onClose }: JobMotivationEmailPanelProps) {
  const dispatch = useAppDispatch();

  const [motivationEmail, setMotivationEmail] = useState<string | null>(job.motivation_email || '');
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (job._id) {
      try {
        const updatedJob = await jobRepository.update(job._id.toString(), { motivation_email: motivationEmail });
        if (!updatedJob) setError('Failed to update the job motivation email.');
        else {
          dispatch(updateLikedJob(updatedJob));
          handleClose();
        }
      } catch (err) {
        setError(`Error updating job motivation email: ${String(err)}`);
      }
    }
  }

  const handleClose = () => {
    // Call the onClose function if provided
    if (typeof onClose === 'function') onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-lg font-bold border-b-1 border-b-gray-300">Edit Motivation Email</h2>
        <textarea
          className="w-full p-2 border border-gray-300 rounded mt-2"
          value={motivationEmail || ''}
          onChange={(e) => setMotivationEmail(e.target.value)}
          rows={10}
          cols={50}
        />
        <button
          className="mt-4 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
      {error && (
        <div className="mt-2 text-red-500">
          <strong>Error:</strong>
          {error}
          <button
            className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => setError(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}