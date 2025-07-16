import { IJobEntity, JOB_DISLIKED, JOB_LIKED } from "@/types/IJobEntity";
import { useState } from "react";
import { RepositoryFactory } from "../dal/RepositoryFactory";
import { useAppDispatch } from "../store";
import { updateLikedJob, updateDislikedJob, setJobSelected } from "../store/jobsReducer";

const jobRepository = RepositoryFactory.getInstance().getJobRepository();

interface JobMotivationLetterPanelProps {
  job: IJobEntity;
  onClose?: () => void;
}

export default function JobMotivationLetterPanel({ job, onClose }: JobMotivationLetterPanelProps) {
  const dispatch = useAppDispatch();

  const [motivationLetter, setMotivationLetter] = useState<string | null>(job.motivation_letter || '');
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (job._id && motivationLetter !== null) {
      try {
        const updatedJob = await jobRepository.update(job._id.toString(), { motivation_letter: motivationLetter });
        if (!updatedJob) setError('Failed to update the job motivation letter.');
        else {
          dispatch(setJobSelected(updatedJob));
          switch (job.preference) {
            case JOB_LIKED:
              dispatch(updateLikedJob(updatedJob));
              break;
            case JOB_DISLIKED:
              dispatch(updateDislikedJob(updatedJob));
              break;
            default:
              setError(`Unknown job preference: ${job.preference}`);
              return;
          }
          handleClose();
        }
      } catch (err) {
        setError(`Error updating job motivation letter: ${String(err)}`);
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
        <h2 className="text-lg font-bold border-b-1 border-b-gray-300">Edit Motivation Letter</h2>
        <textarea
          className="w-full p-2 border border-gray-300 rounded mt-2"
          value={motivationLetter || ''}
          onChange={(e) => setMotivationLetter(e.target.value)}
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
    </div>
  );
}