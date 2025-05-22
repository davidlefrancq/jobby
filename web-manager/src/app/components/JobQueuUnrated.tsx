'use client';

import { useEffect, useState } from "react";
import { RepositoryFactory } from "../dal/RepositoryFactory";
import { useAppDispatch, useAppSelector } from "../store";
import { IJobEntity } from "@/types/IJobEntity";
import { setJobs, setSkip, setUnpreferencedCounter } from "../store/jobsReducer";
import JobCard from "./JobCard";
import { addAlert } from "../store/alertsReducer";
import { MessageType } from "@/types/MessageType";
import { JobQueueEnum } from "@/constants/JobQueueEnum";

const jobRepository = RepositoryFactory.getInstance().getJobRepository();

let firstLoad = true;

export default function JobQueueUnrated() {
  const dispatch = useAppDispatch()
  const { jobs, jobQueueSelected, limit, skip, unpreferencedCounter } = useAppSelector(state => state.jobsReducer)

  const [jobsUnrated, setJobsUnrated] = useState<IJobEntity[]>([]);
  const [jobTargeted, setJobTargeted] = useState<IJobEntity | null>(null);

  const addJobs = (newJobs: IJobEntity[]) => {
    // jobs filtered without newJobs
    const filteredJobs = jobs.filter(job => !newJobs.some(newJob => newJob._id === job._id));
    // persist in the store
    dispatch(setJobs([...filteredJobs, ...newJobs]));
    dispatch(setSkip(skip + newJobs.length));
  }

  const loadUnratedJobs = async () => {
    const data = await jobRepository.getAll({ filter: { preference: 'null' }, limit, skip });
    if (data) {
      addJobs(data);
    }
  }

  const loadUnpreferencedJobsConter = () => {
    jobRepository.getJobsUnpreferencedCounter().then(count => {
      if (count >= 0) {
        dispatch(setUnpreferencedCounter(count));
      } else {
        handleAddError('Failed to load unpreferenced jobs counter.', 'error');
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
    try {
      await saveUpdatedJobs({ job: { _id: job._id, preference: 'like' } });
      const newJobs = jobs.filter(j => j._id !== job._id);
      dispatch(setJobs(newJobs));
      dispatch(setUnpreferencedCounter(unpreferencedCounter - 1));
    } catch (error) {
      console.error(error);
      handleAddError('Failed to like job.', 'error');
    }
  };

  const handleDislike = async (job: IJobEntity) => {
    try { 
      await saveUpdatedJobs({ job: { _id: job._id, preference: 'dislike' } });
      const newJobs = jobs.filter(j => j._id !== job._id);
      dispatch(setJobs(newJobs));
      dispatch(setUnpreferencedCounter(unpreferencedCounter - 1));
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
    if (firstLoad) {
      firstLoad = false;
      loadUnpreferencedJobsConter()
      loadUnratedJobs().then(() => {}).catch(err => {
        handleAddError(err.message, 'error');
      });
    }
  }, []);

  // Update jobsUnrated list from jobs
  useEffect(() => {
    setJobsUnrated(jobs.filter(job => job.preference === undefined || job.preference === null));
  }, [jobs]);

  // Update jobTargeted when jobsUnrated changes
  useEffect(() => {
    if (jobsUnrated.length > 0) {
      setJobTargeted(jobsUnrated[0]);
    } else {
      setJobTargeted(null);
    }
  }, [jobsUnrated]);

  return (      
    <div className={`grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 ${jobQueueSelected === JobQueueEnum.Unrated ? '' : 'hidden'}`}>
      { jobTargeted ? <JobCard key={jobTargeted._id.toString()} job={jobTargeted} onLike={handleLike}  onDislike={handleDislike} /> : null }
      <div className="flex flex-col items-center justify-center w-full h-full">
        <span className="text-lg font-semibold text-gray-500">{unpreferencedCounter ? unpreferencedCounter : 'No more offers.'}</span>
      </div>
    </div>      
  );
}