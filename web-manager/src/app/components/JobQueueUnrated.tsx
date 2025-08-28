'use client';

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RepositoryFactory } from "../dal/RepositoryFactory";
import { useAppDispatch, useAppSelector } from "../store";
import { IJobEntity } from "@/types/IJobEntity";
import { setUnratedJobs, removeUnratedJob, setUnratedCounter, addLikedJob, addDislikedJob, setUnratedSkip, setUnratedInLoading } from "../store/jobsReducer";
import JobCard from "./JobCard";
import { addAlert } from "../store/alertsReducer";
import { MessageType } from "@/types/MessageType";
import { JobQueueEnum } from "@/constants/JobQueueEnum";

const jobRepository = RepositoryFactory.getInstance().getJobRepository();

export default function JobQueueUnrated() {
  const hasRun = useRef(false);

  const dispatch = useAppDispatch();
  const { unratedJobs: jobs, unratedInLoading, jobQueueSelected, unratedCounter, unratedSkip} = useAppSelector(state => state.jobsReducer);
  const { franceTravailStarted, linkedInStarted } = useAppSelector(state => state.n8nReducer);

  const [jobsUnrated, setJobsUnrated] = useState<IJobEntity[]>([]);
  const [jobTargeted, setJobTargeted] = useState<IJobEntity | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const addJobs = (newJobs: IJobEntity[]) => {
    // Jobs filtered without newJobs
    const filteredJobs = jobs.filter(job => !newJobs.some(newJob => newJob._id === job._id));
    // Persist in the store
    dispatch(setUnratedJobs([...filteredJobs, ...newJobs]));
  }

  const loadUnratedJobs = async () => {
    if (!unratedInLoading && hasMore) {
      dispatch(setUnratedInLoading(true));
      try {
        const data = await jobRepository.getAll({ filter: { preference: 'null' }, limit: 9, skip: unratedSkip });
        if (data && data.length > 0) {
          dispatch(setUnratedSkip(unratedSkip + data.length));
          addJobs(data);
        } else if (data && data.length === 0) {
          setHasMore(false);
        } else {
          handleAddError('Failed to load unrated jobs.', 'error');
        }
      } catch (error) {
        console.error(error);
        handleAddError('Failed to load unrated jobs.', 'error');
      } finally {
        // Reset loading state
        dispatch(setUnratedInLoading(false));
      }
    }
  }

  const loadUnratedJobsCounter = () => {
    jobRepository.getJobsUnratedCounter().then(count => {
      if (count >= 0) {
        dispatch(setUnratedCounter(count));
      } else {
        handleAddError('Failed to load unrated jobs counter.', 'error');
      }
    }).catch(err => {
      handleAddError(err.message, 'error');
    })
  }

  const handleAddError = (message: string, type: MessageType) => {
    const errorMessage = {
      date: new Date().toISOString(),
      message,
      type,
    };
    dispatch(addAlert(errorMessage));
  }

  const handleLike = async (job: IJobEntity) => {
    if (!job || !job._id) {
      handleAddError('Like: Job not found.', 'error');
      return;
    }

    try {
      await saveUpdatedJobs({ job: { _id: job._id, preference: 'like' } });
      dispatch(removeUnratedJob(job._id.toString()));
      dispatch(addLikedJob(job));
      dispatch(setUnratedCounter(unratedCounter - 1));
    } catch (error) {
      console.error(error);
      handleAddError('Failed to like job.', 'error');
    }
  };

  const handleDislike = async (job: IJobEntity) => {
    if (!job || !job._id) {
      handleAddError('Dislike: Job not found.', 'error');
      return;
    }

    try { 
      await saveUpdatedJobs({ job: { _id: job._id, preference: 'dislike', interest_indicator: '🔴' } });
      dispatch(removeUnratedJob(job._id.toString()));
      dispatch(addDislikedJob(job));
      dispatch(setUnratedCounter(unratedCounter - 1));
    } catch (error) {
      console.error(error);
      handleAddError('Failed to dislike job.', 'error');
    }
  };

  const saveUpdatedJobs = async ({ job }: { job: Partial<IJobEntity> }) => {
    let response: IJobEntity | null = null
    const { _id, ...jobRest } = job;
    if (_id) {
      try {
        response = await jobRepository.update(_id.toString(), jobRest);
      } catch (err) {
        let msg = 'Failed to update job.';
        if (err instanceof Error) msg = err.message;
        handleAddError(msg, 'error');
      }
    }
    return response;
  }

  // Load the first batch of jobs
  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      loadUnratedJobsCounter()
      loadUnratedJobs().then(() => {}).catch(err => {
        handleAddError(err.message, 'error');
      });
    }
  }, []);

  // Load more when n8n workflows are finished
  useEffect(() => {
    if (!unratedInLoading) {
      if (!franceTravailStarted && !linkedInStarted) {
        loadUnratedJobsCounter()
        loadUnratedJobs().then(() => {}).catch(err => {
          handleAddError(err.message, 'error');
        });
      }
    }
  }, [franceTravailStarted, linkedInStarted]);

  // Update jobsUnrated list from jobs
  useEffect(() => {
    setJobsUnrated(jobs.filter(job => job.preference === undefined || job.preference === null));
  }, [jobs]);

  // Update jobTargeted when jobsUnrated changes
  useEffect(() => {
    if (jobsUnrated.length > 0) {
      setJobTargeted(jobsUnrated[0]);
      if (jobsUnrated.length === 1) {
        loadUnratedJobs().then(() => {}).catch(err => {
          handleAddError(err.message, 'error');
        });        
      }
    } else {
      setJobTargeted(null);
    }
  }, [jobsUnrated]);

  useEffect(() => {

  }, [unratedCounter]);

  return (      
    <div className={`container mx-auto ${jobQueueSelected === JobQueueEnum.unrated ? '' : 'hidden'}`}>
      <div className={`grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 ${hasMore ? 'overflow-x-hidden' : ''} min-h[calc(100vh-4rem)]`}>

        <AnimatePresence mode="wait">
          {jobTargeted && jobTargeted._id && (
            <motion.div
              key={jobTargeted._id.toString()}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <JobCard
                job={jobTargeted}
                onLike={handleLike}
                onDislike={handleDislike}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {!hasMore && jobs.length === 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={'no-more-jobs'}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="text-center text-gray-500 bg-gray-100 rounded-lg shadow-md p-4 dark:bg-neutral-900 dark:text-white">
                No more unrated jobs available.
              </div>
            </motion.div>
          </AnimatePresence>
        )}

      </div>
    </div>
  );
}