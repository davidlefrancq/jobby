'use client';

import { useState, useEffect, useRef } from 'react';
import { RefreshCcw } from 'lucide-react';
import JobCard from '@/app/components/JobCard';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setJobs, setLimit, setSkip, setUnpreferencedCounter } from '@/app/store/jobsReducer'
import { addNotification, removeNotification } from '@/app/store/notificationsReducer';
import { IJobEntity } from '@/types/IJobEntity';
import { N8NWorkflow, StartWorkflowProps } from '../lib/N8NWorkflow';
import BtnLoading from './BtnLoading';
import { N8N_WORKFLOW_NAMES } from '@/constants/n8n-webhooks';
import ProgressBar from './ProgressBar';
import NotificationsPanel from './NotificationsPanel';
import { RepositoryFactory } from '../dal/RepositoryFactory';
import Link from 'next/link';
import ErrorsPanel from './ErrorsPanel';
import { addAlert } from '../store/alertsReducer';
import { MessageType } from '@/types/MessageType';


interface JobBoardProps {
  onView: (job: IJobEntity) => void;
}

const n8nWorkflow = new N8NWorkflow(); // N8N Workflow manager
const repositoryFactory = RepositoryFactory.getInstance(); // Repository factory
const jobRepository = repositoryFactory.getJobRepository(); // Job repository
let loading = false;
let updating = false;
let firstLoad = true;

export default function JobBoard({}: JobBoardProps) {
  const dispatch = useAppDispatch()
  const { jobs, limit, skip, unpreferencedCounter } = useAppSelector(state => state.jobsReducer)
  const { notifications } = useAppSelector(state => state.notificationsReducer)

  const [jobsUnpreferenced, setJobsUnpreferenced] = useState<IJobEntity[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [jobTargeted, setJobTargeted] = useState<IJobEntity | null>(null);
  const [startedFtWorkflow, setStartedFtWorkflow] = useState(false);
  const [startedGoogleAlertsWorkflow, setStartedGoogleAlertsWorkflow] = useState(false);
  const [startedLinkedInWorkflow, setStartedLinkedInWorkflow] = useState(false);
  const [workflowProgressPercent, setWorkflowProgressPercent] = useState(100);
  const [refresh, setRefresh] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch 9 jobs per page
  const loadJobs = async () => {
    if (!hasMore) return;
    if (loading) return;
    loading = true;
    
    // Load initial unpreferenced jobs counter
    if (firstLoad) {
      firstLoad = false;
      loadUnpreferencedJobsConter();
    }

    try {
      // Fetch jobs from the API
      const data = await jobRepository.getAll({ filter: { preference: 'null' }, limit, skip });

      // Persist the jobs in the Redux store
      const newJobs = data.filter(job => !jobs.some(j => j._id === job._id && (j.preference === null || j.preference === undefined)));
      dispatch(setJobs([...jobs, ...newJobs]));
      dispatch(setSkip(skip + data.length));
      
      // Check if there are more jobs to load
      if (data.length < limit) {
        setHasMore(false);
      }
    } catch (err) {
      let msg = 'Failed to load jobs.';
      if (err instanceof Error) msg = err.message;
      handleAddError(msg, 'error');
    } finally {
      loading = false;
      setRefresh(!refresh);
    }
  };

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

  const sendUpdatedJobs = async ({ job }: { job: Partial<IJobEntity> }) => {
    let response: IJobEntity | null = null
    const { _id, ...jobRest } = job;
    if (!updating && _id) {
      updating = true;
      try {
        response = await jobRepository.update(_id.toString(), jobRest);
      } catch (err) {
        let msg = 'Failed to update job.';
        if (err instanceof Error) msg = err.message;
        handleAddError(msg, 'error');
      } finally {
        updating = false;
      }
    }
    return response;
  }

  const workflowSetError = (error: string) => {
    handleAddError(error, 'error');
  }

  const handleAddError = (message: string, type: MessageType) => {
    const errorMessage = {
      date: new Date().toISOString(),
      message,
      type,
    };
    dispatch(addAlert(errorMessage));
  }

  // Handle like/dislike actions
  const handleLike = async (job: IJobEntity) => {
    try {
      await sendUpdatedJobs({ job: { _id: job._id, preference: 'like' } });
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
      await sendUpdatedJobs({ job: { _id: job._id, preference: 'dislike' } });
      const newJobs = jobs.filter(j => j._id !== job._id);
      dispatch(setJobs(newJobs));
      dispatch(setUnpreferencedCounter(unpreferencedCounter - 1));
    } catch (error) {
      console.error(error);
      handleAddError('Failed to dislike job.', 'error');
    }
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

  const workflowFranceTravailHandler = async () => {
    if (!startedFtWorkflow) {
      setStartedFtWorkflow(true);
      try {
        const workflow: StartWorkflowProps = {
          workflow: N8N_WORKFLOW_NAMES.FranceTravail,
          setError: workflowSetError
        };
        await n8nWorkflow.startWorkflow(workflow);
      } catch (error) {
        console.error(error);
        handleAddError('Failed to start FranceTravail workflow.', 'error');
      } finally{
        setStartedFtWorkflow(false);
        handleAddNotification('Workflow FranceTravail finished.');
      }
    }
  }

  const workflowGoogleAlertsHandler = async () => {
    if (!startedGoogleAlertsWorkflow) {
      setStartedGoogleAlertsWorkflow(true);
      try {
        const workflow: StartWorkflowProps = {
          workflow: N8N_WORKFLOW_NAMES.GoogleAlerts,
          setError: workflowSetError
        };
        await n8nWorkflow.startWorkflow(workflow);
      } catch (error) {
        console.error(error);
        handleAddError('Failed to start GoogleAlerts workflow.', 'error');
      } finally {
        setStartedGoogleAlertsWorkflow(false);
        handleAddNotification('Workflow GoogleAlerts finished.');
      }
    }
  }
  
  const workflowLinkedInHandler = async () => {
    if (!startedLinkedInWorkflow) {
      setStartedLinkedInWorkflow(true);
      try {
        const workflow: StartWorkflowProps = {
          workflow: N8N_WORKFLOW_NAMES.LinkedIn,
          setError: workflowSetError
        };
        await n8nWorkflow.startWorkflow(workflow);
      } catch (error) {
        console.error(error);
        handleAddError('Failed to start LinkedIn workflow.', 'error');
      } finally {
        setStartedLinkedInWorkflow(false);
        handleAddNotification('Workflow LinkedIn finished.');
      }
    }
  }

  const workflowHandler = async (workflow: N8N_WORKFLOW_NAMES) => {
    switch (workflow) {
      case N8N_WORKFLOW_NAMES.FranceTravail:
        workflowFranceTravailHandler();
        break;
      case N8N_WORKFLOW_NAMES.GoogleAlerts:
        workflowGoogleAlertsHandler();
        break;
      case N8N_WORKFLOW_NAMES.LinkedIn:
        workflowLinkedInHandler();
        break;
      default:
        handleAddError('Unknown workflow.', 'error');
        break;
    }
  }

  const workflowsBtnHandler = async () => {
    if (!startedFtWorkflow && !startedGoogleAlertsWorkflow && !startedLinkedInWorkflow) {
      setWorkflowProgressPercent(0);
      await workflowHandler(N8N_WORKFLOW_NAMES.FranceTravail);
      // setWorkflowProgressPercent(33);
      // await workflowHandler(N8N_WORKFLOW_NAMES.GoogleAlerts);
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
    <div className="relative pb-12">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Jobby</h1>
          {/* Actions bar */}
          <div className="flex items-center gap-2">
            <BtnLoading title={<RefreshCcw size={18} />} width={'40px'} loading={startedFtWorkflow || startedGoogleAlertsWorkflow || startedLinkedInWorkflow} onClick={() => workflowsBtnHandler()} />
            <Link
              href={"http://localhost:5678"}
              target="_blank"
              className="bg-red-400 text-white p-0 rounded-full opacity-75 hover:opacity-100"
            >
              <img src="n8n.png" alt="Rocket" className="w-10 h-10 rounded-full" />
            </Link>
            <NotificationsPanel notifications={notifications} removeNotification={(id: number) => handleRemoveNotification(id)} />
          </div>
        </div>

        {/* Errors Panel */}
        <ErrorsPanel />

        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
          { jobTargeted ? <JobCard key={jobTargeted._id.toString()} job={jobTargeted} onLike={handleLike}  onDislike={handleDislike} /> : null }
        </div>

        <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
          {loading
            ? <span className="text-gray-600">Loading...</span>
            : !hasMore && jobsUnpreferenced.length == 0
            ? <span className="text-gray-500">No more offers.</span>
            : null}
        </div>
      </div>

      {/* Barre info fixe */}
      <div className="fixed bottom-0 left-0 w-full py-2 text-center text-sm text-gray-700">
        { workflowProgressPercent === 100 && unpreferencedCounter > 0 ? (<div>Jobs queue : {unpreferencedCounter}</div>) : null }
        { workflowProgressPercent !== 100 ? <ProgressBar text={`${Math.round(workflowProgressPercent).toLocaleString()}%`} width={`${Math.round(workflowProgressPercent)}%`} /> : null }
      </div>
    </div>
  );
}
