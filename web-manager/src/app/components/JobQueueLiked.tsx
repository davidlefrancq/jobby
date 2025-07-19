'use client';

import { IJobEntity } from "@/types/IJobEntity";
import { useAppDispatch, useAppSelector } from "../store";
import JobTable from "./JobTable";
import { JobQueueEnum } from "@/constants/JobQueueEnum";
import { RepositoryFactory } from "../dal/RepositoryFactory";
import { useEffect, useRef, useState } from "react";
import { setLikedJobs, setLikedSkip, setLikedCounter, setJobSelected } from "../store/jobsReducer";
import { addAlert } from "../store/alertsReducer";
import { MessageType } from "@/types/MessageType";
import JobModal from "./JobModal";
import FullscreenModal from "./FullscreenModal";

const jobRepository = RepositoryFactory.getInstance().getJobRepository();

let firstLoad = true;

export default function JobQueueLiked() {
  const dispatch = useAppDispatch()
  const { likedJobs, jobQueueSelected, likedLimit: limit, likedSkip: skip, jobSelected } = useAppSelector(state => state.jobsReducer)

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const addJobs = (newJobs: IJobEntity[]) => {
    // Jobs filtered without newJobs
    const filteredJobs = likedJobs.filter(job => !newJobs.some(newJob => newJob._id === job._id));
    // Persist in the store
    dispatch(setLikedJobs([...filteredJobs, ...newJobs]));
    dispatch(setLikedSkip(skip + newJobs.length));
    // Disable the loader if there are no more jobs from load
    if (newJobs.length < limit) {
      setHasMore(false);
    }
  }

  const loadLikedJobs = async () => {
    const data = await jobRepository.getAll({ filter: { preference: 'like' }, limit, skip });
    if (data) {
      addJobs(data);
    }
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

  const handleAddError = (message: string, type: MessageType) => {
    const errorMessage = {
      date: new Date().toISOString(),
      message,
      type,
    };
    dispatch(addAlert(errorMessage));
  }

  // Load the first batch of jobs
  useEffect(() => {
    if (firstLoad && jobQueueSelected === JobQueueEnum.Liked) {
      firstLoad = false;
      loadLikedJobsCounter()
      loadLikedJobs().then(() => {}).catch(err => {
        handleAddError(err.message, 'error');
      });
    }
  }, [jobQueueSelected]);

  // Load more jobs
  useEffect(() => {
    if (jobQueueSelected !== JobQueueEnum.Liked || !loaderRef.current || !hasMore || isFetching) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setIsFetching(true);
          loadLikedJobs()
            .catch(err => handleAddError(err.message, 'error'))
            .finally(() => setIsFetching(false));
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef, hasMore, isFetching, skip]);

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 mt-1 ${jobQueueSelected === JobQueueEnum.Liked ? '' : 'hidden'}`}>
      
      <JobTable jobs={likedJobs} onView={(job: IJobEntity) => dispatch(setJobSelected(job))} />

      <div ref={loaderRef} className="h-80"></div>
      <div className="text-center text-sm text-gray-400 mt-2 mb-6">
        {!hasMore && "No more liked job"}
        {isFetching && hasMore && "Loading..."}
      </div>

      <FullscreenModal title={jobSelected ?  jobSelected.title || '': ''} onClose={() => dispatch(setJobSelected(null))} >
        { jobSelected && <JobModal onClose={() => dispatch(setJobSelected(null))} /> }
      </FullscreenModal>
    </div>
  );
}