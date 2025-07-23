import { useAppDispatch, useAppSelector } from "../store";
import { updateLikedJob, setJobSelected } from "../store/jobsReducer";

export default function JobExplorer() {
  const dispatch = useAppDispatch();
  const { likedJobs, jobSelected } = useAppSelector(state => state.jobsReducer);

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Job Explorer</h2>
      {likedJobs.map(job => (
        <div key={job._id?.toString()} className="border p-4 mb-4">
          <h3 className="text-xl font-semibold">{job.title}</h3>
          <p>{job.description}</p>
          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => dispatch(setJobSelected(job))}
          >
            View Details
          </button>
        </div>
      ))}
      {likedJobs.length === 0 && (
        <p className="text-gray-500">No jobs liked yet.</p>
      )}
    </div>
  );
}