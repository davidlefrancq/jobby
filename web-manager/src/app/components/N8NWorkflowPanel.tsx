'use client';

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { addAlert } from '@/app/store/alertsReducer';
import { 
  setIsStartedWorkflows,
  setFranceTravailStarted,
  setFranceTravailStatus,
  setLinkedInStarted,
  setLinkedInStatus,
  setCompaniesDetailsStarted,
} from '@/app/store/n8nReducer';
import { addNotification } from '@/app/store/notificationsReducer';
import { N8NWorkflow, StartWorkflowProps } from "../lib/N8NWorkflow";
import { N8N_WORKFLOW_NAMES } from "@/constants/n8n-webhooks";

const n8nWorkflow = N8NWorkflow.getInstance();
const nbWorkflows = 3; // Number of workflows to track progress

export default function N8NWorkflowPanel() {
  const dispatch = useAppDispatch()
  const {
    isStartedWorkflows,
    franceTravailStarted,
    linkedInStarted,
  } = useAppSelector(state => state.n8nReducer)

  const [progress, setProgress] = useState(0);    
  const hiddenClass = isStartedWorkflows ? '' : 'hidden';

  const onFinishHandle = () => {
    dispatch(setFranceTravailStarted(false));
    dispatch(setLinkedInStarted(false));
    dispatch(setCompaniesDetailsStarted(false));
    dispatch(setIsStartedWorkflows(false));
  }

  const workflowFranceTravailHandler = async () => {
    if (!franceTravailStarted) {
      dispatch(setFranceTravailStarted(true));
      dispatch(setFranceTravailStatus('processing'));
      try {
        const workflow: StartWorkflowProps = {
          workflow: N8N_WORKFLOW_NAMES.FranceTravail,
          setError: (error: string) => {
            dispatch(addAlert({ date: new Date().toISOString(), message: error, type: 'error' }));
          }
        };
        await n8nWorkflow.startWorkflow(workflow);
        dispatch(setFranceTravailStatus('success'));
      } catch (error) {
        dispatch(setFranceTravailStatus('error'));
        console.error(error);
        dispatch(addAlert({
          date: new Date().toISOString(),
          message: 'Failed to start FranceTravail workflow.',
          type: 'error'
        }));
      } finally{
        dispatch(setFranceTravailStarted(false));
        dispatch(addNotification({ id: Date.now(), message: 'Workflow FranceTravail finished.' }));
      }
    }
  }
  
  const workflowLinkedInHandler = async () => {
    if (!linkedInStarted) {
      dispatch(setLinkedInStarted(true));
      dispatch(setLinkedInStatus('processing'));
      try {
        const workflow: StartWorkflowProps = {
          workflow: N8N_WORKFLOW_NAMES.LinkedIn,
          setError: (error: string) => {
            dispatch(addAlert({
              date: new Date().toISOString(),
              message: error,
              type: 'error'
            }));
          }
        };
        await n8nWorkflow.startWorkflow(workflow);
        dispatch(setLinkedInStatus('success'));
      } catch (error) {
        dispatch(setLinkedInStatus('error'));
        console.error(error);
        dispatch(addAlert({
          date: new Date().toISOString(),
          message: 'Failed to start LinkedIn workflow.',
          type: 'error'
        }));
      } finally {
        dispatch(setLinkedInStarted(false));
        dispatch(addNotification({
          id: Date.now(),
          message: 'Workflow LinkedIn finished.'
        }));
      }
    }
  }

  const runWorkflows = async () => {
    await workflowFranceTravailHandler();
    await workflowLinkedInHandler();
  }

  useEffect(() => {
    let counter = 0;
    if (franceTravailStarted) counter++;
    if (linkedInStarted) counter++;
    const progress = (counter / nbWorkflows) * 100;
    setProgress(progress);
  }, [franceTravailStarted, linkedInStarted]);

  useEffect(() => {
    if (isStartedWorkflows && !franceTravailStarted && !linkedInStarted) {      
      runWorkflows().then(() => {
        setProgress(100);
        setTimeout(() => {
          setProgress(0);
          onFinishHandle();
        }, 2000);
      }).catch(err => {
        const msg = `Failed to start workflow: ${String(err)}`;
        dispatch(addAlert({ date: new Date().toISOString(), message: msg, type: 'error' }));
      })
    }
  }, [isStartedWorkflows]);

  return (
    <div className={`w-full h-2 bg-gray-200 rounded-full ${hiddenClass}`}>
      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
    </div>
  );
}