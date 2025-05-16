import { N8N_FRANCETRAVAIL_WEBHOOK, N8N_GOOGLEALERTS_WEBHOOK, N8N_LINKEDIN_WEBHOOK, N8N_WORKFLOW_NAMES } from "@/constants/n8n-webhooks";

const ERROR_MISSING_WEBHOOK = 'Missing webhook URL.';
const ERROR_UNKNOWN_WORKFLOW = 'Unknown workflow.';
const ERROR_WORKFLOW_EXECUTION = 'Error executing workflow.';
const ERROR_WORKFLOW_EXECUTION_DETAILS = `${ERROR_WORKFLOW_EXECUTION} Details:`;

type WorkflowResponse = {
  error: string | null;
}

interface StartWorkflowProps {
  workflow: N8N_WORKFLOW_NAMES;
  setError: (error: string) => void;
}

export class N8NWorkflow {
  started = {
    FranceTravail: false,
    GoogleAlerts: false,
    LinkedIn: false,
  };

  constructor() {}

  static N8N_WEBHOOKS = {
    LinkedIn: {
      name: N8N_WORKFLOW_NAMES.LinkedIn,
      url: N8N_LINKEDIN_WEBHOOK
    },
    FranceTravail: {
      name: N8N_WORKFLOW_NAMES.FranceTravail,
      url: N8N_FRANCETRAVAIL_WEBHOOK
    },
    GoogleAlerts: {
      name: N8N_WORKFLOW_NAMES.GoogleAlerts,
      url: N8N_GOOGLEALERTS_WEBHOOK
    },
  };

  static getN8NWorkflowName(url: string): N8N_WORKFLOW_NAMES | null {
    const makeUrlToNameMapper = () => {
      return Object.values(N8NWorkflow.N8N_WEBHOOKS).reduce((map, { name, url }) => {
        map[url] = name;
        return map;
      }, {} as Record<string, N8N_WORKFLOW_NAMES>);
    }
    const mapper = makeUrlToNameMapper();
    return mapper[url] ?? null;
  }

  private fetchWorkflow = async (url: string) => {
    if (!url) throw new Error(ERROR_MISSING_WEBHOOK);
    let errMsg: string | null = null;
    
    try {
      const res = await fetch(url, { method: 'GET' });
      if (!res.ok) errMsg = `Error ${res.status}: ${res.statusText}`;  
    } catch (err) {
        const workflowName = N8NWorkflow.getN8NWorkflowName(url);
        errMsg = `${ERROR_WORKFLOW_EXECUTION} For ${workflowName} workflow:`;
        if (err instanceof Error) errMsg += ` ${err.message}`;
        else if (typeof err === 'string') errMsg += ` ${err}`;
        else errMsg += ` ${String(err)}`;
    }
    return { error: errMsg };
  }

  private startFrancetTravailWorkflow = async () => {
    const response: WorkflowResponse = { error: null };
    if (!this.started.FranceTravail) {
      this.started.FranceTravail = true;
      const { FranceTravail } = N8NWorkflow.N8N_WEBHOOKS;
      const { error } = await this.fetchWorkflow(FranceTravail.url);
      if (error) response.error = error;
      this.started.FranceTravail = false;
    }
    return response;
  }

  private startGoogleAlertsWorkflow = async () => {
    const response: WorkflowResponse = { error: null };
    if (!this.started.GoogleAlerts) {
      this.started.GoogleAlerts = true;
      const { GoogleAlerts } = N8NWorkflow.N8N_WEBHOOKS;
      const { error } = await this.fetchWorkflow(GoogleAlerts.url);
      if (error) response.error = error;
      this.started.GoogleAlerts = false;
    }
    return response;
  }

  private startLinkedInWorkflow = async () => {
    const response: WorkflowResponse = { error: null };
    if (!this.started.LinkedIn) {
      this.started.LinkedIn = true;
      const { LinkedIn } = N8NWorkflow.N8N_WEBHOOKS;
      const { error } = await this.fetchWorkflow(LinkedIn.url);
      if (error) response.error = error;
      this.started.LinkedIn = false;
    }
    return response;
  }

  startWorkflow = async ({ workflow, setError }: StartWorkflowProps) => {
    try {
      switch (workflow) {
        case N8N_WORKFLOW_NAMES.FranceTravail:
          const ftResponse = await this.startFrancetTravailWorkflow();
          if (ftResponse.error) setError(ftResponse.error);
          break;
        case N8N_WORKFLOW_NAMES.GoogleAlerts:
          const gaResponse = await this.startGoogleAlertsWorkflow();
          if (gaResponse.error) setError(gaResponse.error);
          break;
        case N8N_WORKFLOW_NAMES.LinkedIn:
          const liResponse = await this.startLinkedInWorkflow();
          if (liResponse.error) setError(liResponse.error);
          break;
        default:
          setError(ERROR_UNKNOWN_WORKFLOW);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`${ERROR_WORKFLOW_EXECUTION_DETAILS} ${err.message}`);
      }
      else if (typeof err === 'string') {
        setError(`${ERROR_WORKFLOW_EXECUTION_DETAILS} ${err}`);
      }
      else {
        setError(`${ERROR_WORKFLOW_EXECUTION_DETAILS} ${String(err)}`);
      }
    }
  }

}
