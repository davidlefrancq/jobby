'use client';

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { addAlert } from '@/app/store/alertsReducer';
import { setFranceTravailStarted, setGoogleAlertsStarted, setLinkedInStarted } from '@/app/store/n8nReducer';
import { addNotification } from '@/app/store/notificationsReducer';
import { N8NWorkflow, StartWorkflowProps } from "../lib/N8NWorkflow";
import { N8N_WORKFLOW_NAMES } from "@/constants/n8n-webhooks";

interface N8NWorkflowPanelProps {
  startedFtWorkflow: boolean;
  resetStartedFtWorkflow: () => void;
}

const n8nWorkflow = new N8NWorkflow();

export default function N8NWorkflowPanel({ startedFtWorkflow, resetStartedFtWorkflow }: N8NWorkflowPanelProps) {
  const dispatch = useAppDispatch()
  const { franceTravailStarted, googleAlertsStarted, linkedInStarted } = useAppSelector(state => state.n8nReducer)

  const [progress, setProgress] = useState(0);    
  const hiddenClass = startedFtWorkflow ? '' : 'hidden';

  const workflowFranceTravailHandler = async () => {
    if (!franceTravailStarted) {
      dispatch(setFranceTravailStarted(true));
      try {
        const workflow: StartWorkflowProps = {
          workflow: N8N_WORKFLOW_NAMES.FranceTravail,
          setError: (error: string) => {
            dispatch(addAlert({ date: new Date().toISOString(), message: error, type: 'error' }));
          }
        };
        await n8nWorkflow.startWorkflow(workflow);
      } catch (error) {
        console.error(error);
        // handleAddError('Failed to start FranceTravail workflow.', 'error');
        dispatch(addAlert({ date: new Date().toISOString(), message: 'Failed to start FranceTravail workflow.', type: 'error' }));
      } finally{
        dispatch(addNotification({ id: Date.now(), message: 'Workflow FranceTravail finished.' }));
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const workflowGoogleAlertsHandler = async () => {
    if (!googleAlertsStarted) {
      dispatch(setGoogleAlertsStarted(true));
      try {
        const workflow: StartWorkflowProps = {
          workflow: N8N_WORKFLOW_NAMES.GoogleAlerts,
          setError: (error: string) => {
            dispatch(addAlert({ date: new Date().toISOString(), message: error, type: 'error' }));
          }
        };
        await n8nWorkflow.startWorkflow(workflow);
      } catch (error) {
        console.error(error);
        dispatch(addAlert({ date: new Date().toISOString(), message: 'Failed to start GoogleAlerts workflow.', type: 'error' }));
      } finally {
        dispatch(addNotification({ id: Date.now(), message: 'Workflow GoogleAlerts finished.' }));
      }
    }
  }
  
  const workflowLinkedInHandler = async () => {
    if (!linkedInStarted) {
      dispatch(setLinkedInStarted(true));
      try {
        const workflow: StartWorkflowProps = {
          workflow: N8N_WORKFLOW_NAMES.LinkedIn,
          setError: (error: string) => {
            dispatch(addAlert({ date: new Date().toISOString(), message: error, type: 'error' }));
          }
        };
        await n8nWorkflow.startWorkflow(workflow);
      } catch (error) {
        console.error(error);
        dispatch(addAlert({ date: new Date().toISOString(), message: 'Failed to start LinkedIn workflow.', type: 'error' }));
      } finally {
        dispatch(addNotification({ id: Date.now(), message: 'Workflow LinkedIn finished.' }));
      }
    }
  }

  const workflowHandler = async () => {
    await workflowFranceTravailHandler();
    // await workflowGoogleAlertsHandler();
    await workflowLinkedInHandler();
  }

  useEffect(() => {
    let counter = 0;
    if (franceTravailStarted) counter++;
    // if (googleAlertsStarted) counter++;
    if (linkedInStarted) counter++;
    const progress = (counter / 3) * 100;
    setProgress(progress);
  }, [franceTravailStarted, googleAlertsStarted, linkedInStarted]);

  useEffect(() => {
    if (startedFtWorkflow && !franceTravailStarted && !linkedInStarted) {      
      workflowHandler().then(() => {
        setProgress(100);
        setTimeout(() => {
          setProgress(0);
          dispatch(setFranceTravailStarted(false));
          dispatch(setGoogleAlertsStarted(false));
          dispatch(setLinkedInStarted(false));
          resetStartedFtWorkflow();
        }, 2000);
      }).catch(err => {
        const msg = `Failed to start workflow: ${String(err)}`;
        dispatch(addAlert({ date: new Date().toISOString(), message: msg, type: 'error' }));
      })
    }
  }, [startedFtWorkflow]);

  return (
    <div className={`w-full h-2 bg-gray-200 rounded-full ${hiddenClass}`}>
      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
    </div>
  );
}