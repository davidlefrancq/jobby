'use client';

import { useState, useEffect, useRef } from 'react';
import { RefreshCcw } from 'lucide-react';
import JobCard from '@/app/components/JobCard';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setJobs, setLimit, setSkip } from '@/app/store/jobsReducer'
import { IJobEntity } from '@/types/IJobEntity';
import { N8NWorkflow } from '../lib/N8NWorkflow';
import BtnLoading from './BtnLoading';
import { N8N_WORKFLOW_NAMES } from '@/constants/n8n-webhooks';
import ProgressBar from './ProgressBar';
import NotificationsPanel from './NotificationsPanel';
import { addNotification, removeNotification } from '../store/notificationsReducer';

interface JobBoardProps {
  onView: (job: IJobEntity) => void;
}

const n8nWorkflow = new N8NWorkflow(); // N8N Workflow manager
let loading = false;
let updating = false;

export default function JobBoard({}: JobBoardProps) {
  const dispatch = useAppDispatch()
  const { jobs, limit, skip } = useAppSelector(state => state.jobsReducer)
  const { notifications } = useAppSelector(state => state.notificationsReducer)

  const [jobsUnpreferenced, setJobsUnpreferenced] = useState<IJobEntity[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobTargeted, setJobTargeted] = useState<IJobEntity | null>(null);
  const [startedFtWorkflow, setStartedFtWorkflow] = useState(false);
  const [startedGoogleAlertsWorkflow, setStartedGoogleAlertsWorkflow] = useState(false);
  const [startedLinkedInWorkflow, setStartedLinkedInWorkflow] = useState(false);
  const [workflowProgressPercent, setWorkflowProgressPercent] = useState(100);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch 9 jobs per page
  const loadJobs = async () => {
    if (!hasMore) return;
    if (loading) return;
    loading = true;
    try {
      // Fetch jobs from the API
      const res = await fetch(`/api/jobs?limit=${limit}&skip=${skip}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: IJobEntity[] = await res.json();

      // Persist the jobs in the Redux store
      const newJobs = data.filter(job => !jobs.some(j => j._id === job._id && (j.preference === null || j.preference === undefined)));
      dispatch(setJobs([...jobs, ...newJobs]));
      dispatch(setSkip(skip + data.length));
      
      // Check if there are more jobs to load
      if (data.length < limit) {
        setHasMore(false);
      }
    } catch (err: unknown) {
      loading = false;
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      loading = false;
    }
  };

  const sendUpdatedJobs = async ({ job }: { job: IJobEntity }) => {
    let response: IJobEntity | null = null
    if (!updating) {
      updating = true;
      try {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        const url = `/api/jobs/${job._id}`;
        const res = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(job) });
        if (!res.ok) {
          console.error(`Error ${res.status}: ${res.statusText}`);
          setError(`Update has failed for job: ${job.title}`);
        }
        else response = (await res.json()) as IJobEntity;
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        updating = false;
      }
    }
    return response;
  }

  // Handle like/dislike actions
  const handleLike = async (job: IJobEntity) => {
    try {
      // Handle like action (e.g., update job status, send to server, etc.)
      const updatedJob: IJobEntity = { ...job, preference: 'like' };
      await sendUpdatedJobs({ job: updatedJob });
      const newJobs = jobs.filter(j => j._id !== job._id);
      dispatch(setJobs(newJobs));
    } catch (error) {
      console.error('Error liking job:', error);
      setError('Failed to like job');
    }
  };

  const handleDislike = async (job: IJobEntity) => {
    // Handle dislike action (e.g., update job status, send to server, etc.)
    const updatedJob: IJobEntity = { ...job, preference: 'dislike' };
    console.log('Disliked job:', updatedJob);
      await sendUpdatedJobs({ job: updatedJob });
      const newJobs = jobs.filter(j => j._id !== job._id);
      dispatch(setJobs(newJobs));
  };

  const handleAddNotification = (message: string) => {
    const notification = {
      id: Date.now(),
      message,
    };
    dispatch(addNotification(notification));
  }

  const handleRemoveNotification = (id: number) => {
    dispatch(removeNotification(id));
  }

  const reload = () => {
    loading = false;
    dispatch(setLimit(9));
    dispatch(setSkip(0));
    setHasMore(true);
    dispatch(setJobs([]));
    setJobsUnpreferenced([]);
  }

  const workflowHandler = async (workflow: N8N_WORKFLOW_NAMES) => {
    switch (workflow) {
      case N8N_WORKFLOW_NAMES.FranceTravail:
        if (!startedFtWorkflow) {
          setStartedFtWorkflow(true);
          await n8nWorkflow.startWorkflow({ workflow: N8N_WORKFLOW_NAMES.FranceTravail, setError });
          setStartedFtWorkflow(false);
          handleAddNotification('Workflow FranceTravail finished');
        }
        break;
      case N8N_WORKFLOW_NAMES.GoogleAlerts:
        if (!startedGoogleAlertsWorkflow) {
          setStartedGoogleAlertsWorkflow(true);
          await n8nWorkflow.startWorkflow({ workflow: N8N_WORKFLOW_NAMES.GoogleAlerts, setError });
          setStartedGoogleAlertsWorkflow(false);
          handleAddNotification('Workflow GoogleAlerts finished');
        }
        break;
      case N8N_WORKFLOW_NAMES.LinkedIn:
        if (!startedLinkedInWorkflow) {
          setStartedLinkedInWorkflow(true);
          await n8nWorkflow.startWorkflow({ workflow: N8N_WORKFLOW_NAMES.LinkedIn, setError });
          setStartedLinkedInWorkflow(false);
          handleAddNotification('Workflow LinkedIn finished');
        }
        break;
      default:
        setError('Unknown workflow');
        break;
    }
  }

  const workflowsBtnHandler = async () => {
    if (!startedFtWorkflow && !startedGoogleAlertsWorkflow && !startedLinkedInWorkflow) {
      setWorkflowProgressPercent(0);
      await workflowHandler(N8N_WORKFLOW_NAMES.FranceTravail);
      setWorkflowProgressPercent(33);
      await workflowHandler(N8N_WORKFLOW_NAMES.GoogleAlerts);
      setWorkflowProgressPercent(66);
      await workflowHandler(N8N_WORKFLOW_NAMES.LinkedIn);
      setWorkflowProgressPercent(99.99);
      setTimeout(() => {
        setWorkflowProgressPercent(100);
        reload();
      }, 500);
    }
  }

  // Initial loading
  useEffect(() => {
    loadJobs();
  }, []);

  // Jobs filtering
  useEffect(() => {
    setJobsUnpreferenced(jobs.filter(job => job.preference === null || job.preference === undefined));
  }, [jobs]);

  // Jobs unpreferenced actions
  useEffect(() => {
    // Focus on the first job in the list
    setJobTargeted(jobsUnpreferenced[0] || null);
    
    // Load more jobs when on the last job in list "jobs"
    if (jobsUnpreferenced.length <= 1) {
      loadJobs();
    }
  }, [jobsUnpreferenced]);

  return (
    <div className="relative min-h-screen pb-12">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Job Board</h1>
          {/* Actions bar */}
          <div className="flex items-center gap-2">
            <BtnLoading title={<RefreshCcw size={18} />} width={'40px'} loading={startedFtWorkflow || startedGoogleAlertsWorkflow || startedLinkedInWorkflow} onClick={() => workflowsBtnHandler()} />
            <NotificationsPanel notifications={notifications} removeNotification={(id: number) => handleRemoveNotification(id)} />
          </div>
        </div>

        {error && <div className="text-red-600 mb-4">Erreur : {error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
          { jobTargeted ? <JobCard key={jobTargeted._id.toString()} job={jobTargeted} onLike={handleLike}  onDislike={handleDislike} /> : null }
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
        { workflowProgressPercent === 100 ? (<div>Job number : {jobsUnpreferenced.length}</div>) : null }        
        { workflowProgressPercent !== 100 ? <ProgressBar text={`${Math.round(workflowProgressPercent).toLocaleString()}%`} width={`${Math.round(workflowProgressPercent)}%`} /> : null }
      </div>
    </div>
  );
}
