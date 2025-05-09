'use client';

import { useState, useEffect, useRef } from 'react';
import JobCard from '@/app/components/JobCard';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setJobs, setSkip } from '@/app/store/jobsReducer'
import { IJobEntity } from '@/types/IJobEntity';

interface JobBoardProps {
  onView: (job: IJobEntity) => void;
}

export default function JobBoard({ onView }: JobBoardProps) {
  const dispatch = useAppDispatch()
  const { jobs, limit, skip } = useAppSelector(state => state.jobsReducer)

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch 9 jobs per page
  const fetchJobs = async () => {
    if (!hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs?limit=${limit}&skip=${skip}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: IJobEntity[] = await res.json();
      const newJobs = data.filter(job => !jobs.some(j => j._id === job._id));
      dispatch(setJobs([...jobs, ...newJobs]));
      dispatch(setSkip(skip + data.length));
      if (data.length < limit) {
        setHasMore(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchJobs();
  }, []);

  // Infinite scroll trigger
  useEffect(() => {
    if (loading || !hasMore) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) fetchJobs();
      },
      { rootMargin: '200px' }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore]);

  return (
    <div className="relative min-h-screen pb-12">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Job Board</h1>

        {error && <div className="text-red-600 mb-4">Erreur : {error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <JobCard key={job._id.toString()} job={job} onClick={() => onView(job)} />
          ))}
        </div>

        <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
          {loading
            ? <span className="text-gray-600">Loading...</span>
            : !hasMore
            ? <span className="text-gray-500">No more offers.</span>
            : null}
        </div>
      </div>

      {/* Barre info fixe */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-50 border-t py-2 shadow-inner text-center text-sm text-gray-700">
        Job number : {jobs.length}
      </div>
    </div>
  );
}
