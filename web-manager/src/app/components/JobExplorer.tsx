import { useEffect, useRef } from "react";
import { RepositoryFactory } from "../dal/RepositoryFactory";
import { useAppDispatch, useAppSelector } from "../store";
import { setLikedCounter, setLikedJobs, setLikedSkip, setLikedHasMore, setLikedInLoading } from "../store/jobsReducer";
import { addAlert } from "../store/alertsReducer";
import { MessageType } from "@/types/MessageType";
import { IJobEntity } from "@/types/IJobEntity";
import JobStatus from "./JobStatus";
import LanguageFlag from "./LanguageFlag";
import { JobTools } from "../lib/JobTools";
import SalaryItem from "./SalaryItem";
import TruncatedText from "./TruncatedText";

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
    <div className="grid grid-cols-2 gap-4">
      {likedJobs.map(job => (
        <div key={job._id?.toString()}>
          <div
            className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70"
          >
            <div className="bg-gray-100 border-b border-gray-200 rounded-t-xl py-3 px-4 md:py-4 md:px-5 dark:bg-neutral-900 dark:border-neutral-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                <TruncatedText text={job.title || "Unknown Title"} length={35} />
              </h3>
              <div className="flex gap-2 mt-1 text-sm text-gray-500 dark:text-neutral-500">
                <JobStatus job={job} showLegend={false} />
                <LanguageFlag language={job.language || ''} cssStyle='w-4 h-4' />
                <TruncatedText text={job.contract_type || ''} length={25} />
                <span className="ml-auto mr-0">
                  <SalaryItem salary={job.salary} />
                </span>
              </div>
            </div>
            <div className="p-4 md:p-5">
              <div className="flex flex-col-3 gap-2">
                <span className="pl-2 pr-2 rounded text-sm bg-white text-gray-800 dark:text-neutral-200 dark:bg-neutral-800">
                  <TruncatedText text={job.company || ''} length={35} />
                </span>
                <span className="pl-2 pr-2 rounded text-sm bg-white text-gray-800 dark:text-neutral-200 dark:bg-neutral-800">
                  <TruncatedText text={job.location || ''} length={35} />
                </span>
              </div>

              <p className="mt-2 text-gray-500 dark:text-neutral-400">
                {job.description ? job.description : 'No description available.'}
              </p>

              <p className="mt-2 text-gray-500 dark:text-neutral-400">
                {/* Technologies */}
                {job.technologies && job.technologies.length > 0 ? (
                  <>
                    {job.technologies.map((tech, index) => (
                      <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 dark:bg-neutral-700 dark:text-white">
                        #{tech}
                      </span>
                    ))}
                  </>
                ) : null}
                {/* Methodologies */}
                {job.methodologies && job.methodologies.length > 0 ? (
                  <>
                    {job.methodologies.map((method, index) => (
                      <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 dark:bg-neutral-700 dark:text-white">
                        #{method}
                      </span>
                    ))}
                  </>
                ) : null}
              </p>

              <div className="flex justify-end mt-4 gap-2 dark:text-neutral-400">
                <span>{job.date ? new Date(job.date).toLocaleDateString() : 'N/A'}</span>
              </div>

              <div className="flex justify-end mt-4 gap-2">
                
                {job.original_job_id && job.source
                  ? <button
                      className="min-w-[150px] px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      onClick={() => window.open(job.source || '', '_blank')}
                    >
                      {JobTools.getSourceName(job)}
                    </button>
                  : 'N/A'
                }

              </div>
            </div>
          </div>
        </div>
      ))}

      <div ref={loaderRef} className="col-span-2"></div>
      
      <div className="col-span-2 text-center text-sm text-gray-400 mt-2 mb-6">
        {!likedHasMore && "No more liked job."}
        {likedInLoading && likedHasMore && "Loading..."}
      </div>
    </div>
  );
}