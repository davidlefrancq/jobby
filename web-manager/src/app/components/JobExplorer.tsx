import { useEffect, useRef } from "react";
import { RepositoryFactory } from "../dal/RepositoryFactory";
import { useAppDispatch, useAppSelector } from "../store";
import { setLikedCounter, setLikedJobs, setLikedSkip, setLikedHasMore, setLikedInLoading, updateDislikedJob, updateLikedJob, updateUnratedJob } from "../store/jobsReducer";
import { addAlert } from "../store/alertsReducer";
import { MessageType } from "@/types/MessageType";
import { IJobEntity } from "@/types/IJobEntity";
import JobStatus from "./JobStatus";
import LanguageFlag from "./LanguageFlag";
import { JobTools } from "../lib/JobTools";
import SalaryItem from "./SalaryItem";
import TruncatedText from "./TruncatedText";
import FieldEditorCompanySiren from "./FieldEditor/FieldEditorCompanySiren";
import { SquareArrowOutUpRight } from "lucide-react";
import { N8NWorkflow } from "../lib/N8NWorkflow";
import { addNotification } from "../store/notificationsReducer";
import JobExplorerCard from "./JobExplorerCard";

const jobRepository = RepositoryFactory.getInstance().getJobRepository();

export default function JobExplorer() {
  const dispatch = useAppDispatch();
  const { likedJobs, likedLimit, likedSkip, likedHasMore, likedInLoading } = useAppSelector(state => state.jobsReducer);

  const isFirstLoad = useRef(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const handleAddError = (message: string, type: MessageType) => {
    const errorMessage = {
      date: new Date().toISOString(),
      message,
      type,
    };
    dispatch(addAlert(errorMessage));
  }

  const loadLikedJobsCounter = () => {
    jobRepository.getJobsLikedCounter().then(count => {
      if (count >= 0) {
        dispatch(setLikedCounter(count));
      } else {
        handleAddError('Failed to load liked jobs counter.', 'error');
      }
    }).catch(err => {
      handleAddError(err.message, 'error');
    })
  }

  const addJobs = (newJobs: IJobEntity[]) => {
    // Jobs filtered without newJobs
    const filteredJobs = likedJobs.filter(job => !newJobs.some(newJob => newJob._id === job._id));
    // Sort jobs by date, with new jobs
    const updatedJobList = [...filteredJobs, ...newJobs].sort((a, b) => {
      if (b.date && a.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
      else if (b.date) return -1;
      else if (a.date) return 1;
      return 0;
    });

    // Persist in the store
    dispatch(setLikedJobs(updatedJobList));
    dispatch(setLikedSkip(updatedJobList.length));
  }

  const loadLikedJobs = async () => {
    if (likedInLoading) return; // Prevent multiple fetches

    dispatch(setLikedInLoading(true));
    const data = await jobRepository.getAll({ filter: { preference: 'like' }, limit: likedLimit, skip: likedSkip });
    if (data) {
      addJobs(data);
      dispatch(setLikedInLoading(false));
    }
    // Disable the loader if there are no more jobs from load
    if (!data || data.length < likedLimit) {
      dispatch(setLikedHasMore(false));
    }
  }

  // Load the first batch of jobs
  useEffect(() => {
    if (isFirstLoad) {
      isFirstLoad.current = false;
      loadLikedJobsCounter()
      loadLikedJobs().then(() => {}).catch(err => {
        handleAddError(err.message, 'error');
      });
    }
  }, []);

  // Load more jobs
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && likedHasMore && !likedInLoading) {
          loadLikedJobs()
            .catch(err => handleAddError(err.message, 'error'))
            .finally(() => dispatch(setLikedInLoading(false)));
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef, likedHasMore, likedInLoading, likedSkip]);

  return (
    <div className="w-full">
      <div className="grid sm:grid-cols-1 lg:grid-cols-1 gap-2">
        {likedJobs.map(job => job._id && (
          <JobExplorerCard key={job._id.toString()} job={job} />
        ))}
      </div>

      {/* Loader for more jobs */}
      <div className="grid grid-cols-1 gap-2 mt-4">
        <div ref={loaderRef} className="col-span-2"></div>
        
        <div className="col-span-1 text-center text-sm text-gray-400 mt-2 mb-6">
          {!likedHasMore && "No more liked job."}
          {likedInLoading && likedHasMore && "Loading..."}
        </div>
      </div>

    </div>
  );
}