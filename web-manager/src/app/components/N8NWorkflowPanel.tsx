'use client';

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { addAlert } from '@/app/store/alertsReducer';
import { 
  setIsStartedWorkflows,
  setFranceTravailStarted,
  setGoogleAlertsStarted,
  setLinkedInStarted,
  setCompaniesDetailsStarted
} from '@/app/store/n8nReducer';
import { addNotification } from '@/app/store/notificationsReducer';
import { N8NWorkflow, StartWorkflowProps } from "../lib/N8NWorkflow";
import { N8N_WORKFLOW_NAMES } from "@/constants/n8n-webhooks";

const n8nWorkflow = N8NWorkflow.getInstance();
const nbWorkflows = 4; // Number of workflows to track progress

export default function N8NWorkflowPanel() {
  const dispatch = useAppDispatch()
  const {
    isStartedWorkflows,
    franceTravailStarted,
    googleAlertsStarted,
    linkedInStarted,
    companiesDetailsStarted
  } = useAppSelector(state => state.n8nReducer)

  const [progress, setProgress] = useState(0);    
  const hiddenClass = isStartedWorkflows ? '' : 'hidden';

  const onFinishHandle = () => {
    dispatch(setFranceTravailStarted(false));
    dispatch(setGoogleAlertsStarted(false));
    dispatch(setLinkedInStarted(false));
    dispatch(setCompaniesDetailsStarted(false));
    dispatch(setIsStartedWorkflows(false));
  }

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
        dispatch(addAlert({
          date: new Date().toISOString(),
          message: 'Failed to start FranceTravail workflow.',
          type: 'error'
        }));
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
        dispatch(addAlert({
          date: new Date().toISOString(),
          message: 'Failed to start GoogleAlerts workflow.',
          type: 'error'
        }));
      } finally {
        dispatch(addNotification({ id: Date.now(), message: 'Workflow GoogleAlerts finished.' }));
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const workflowCompaniesDetailsHandler = async () => {
    if (!companiesDetailsStarted) {
      dispatch(setCompaniesDetailsStarted(true));
      try {
        const workflow: StartWorkflowProps = {
          workflow: N8N_WORKFLOW_NAMES.CompaniesDetails,
          setError: (error: string) => {
            dispatch(addAlert({ date: new Date().toISOString(), message: error, type: 'error' }));
          }
        };
        await n8nWorkflow.startWorkflow(workflow);
      } catch (error) {
        console.error(error);
        dispatch(addAlert({
          date: new Date().toISOString(),
          message: 'Failed to start CompaniesDetails workflow.',
          type: 'error'
        }));
      } finally {
        dispatch(addNotification({
          id: Date.now(),
          message: 'Workflow CompaniesDetails finished.'
        }));
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
            dispatch(addAlert({
              date: new Date().toISOString(),
              message: error,
              type: 'error'
            }));
          }
        };
        await n8nWorkflow.startWorkflow(workflow);
      } catch (error) {
        console.error(error);
        dispatch(addAlert({
          date: new Date().toISOString(),
          message: 'Failed to start LinkedIn workflow.',
          type: 'error'
        }));
      } finally {
        dispatch(addNotification({
          id: Date.now(),
          message: 'Workflow LinkedIn finished.'
        }));
      }
    }
  }

  const runWorkflows = async () => {
    await workflowFranceTravailHandler();
    // await workflowGoogleAlertsHandler();
    await workflowLinkedInHandler();
    await workflowCompaniesDetailsHandler();
  }

  useEffect(() => {
    let counter = 0;
    if (franceTravailStarted) counter++;
    // if (googleAlertsStarted) counter++;
    if (linkedInStarted) counter++;
    if (companiesDetailsStarted) counter++;
    const progress = (counter / nbWorkflows) * 100;
    setProgress(progress);
  }, [franceTravailStarted, googleAlertsStarted, linkedInStarted, companiesDetailsStarted]);

  useEffect(() => {
    if (isStartedWorkflows && !franceTravailStarted && !linkedInStarted && !companiesDetailsStarted) {      
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