import {
  N8N_WORKFLOW_NAMES,
  N8N_WEBHOOKS,
} from "@/constants/n8n-webhooks";

const ERROR_MISSING_WEBHOOK = 'Missing webhook URL.';
const ERROR_WORKFLOW_EXECUTION = 'Error executing workflow.';

type WorkflowResponse = {
  error: string | null;
}

export interface StartWorkflowProps {
  workflow: N8N_WORKFLOW_NAMES;
  setError: (error: string) => void;
}

export class N8NWorkflow {
  // Holds the singleton instance
  private static instance: N8NWorkflow | null = null;
  
  private started = {
    FranceTravailLoadingJob: false,
    FranceTravailGmail: false,
    FranceTravailData: false,
    FranceTravailAI: false,
    LinkedIn: false,
    CompaniesDetails: false,
    CompanyDetails: false,
    CVMotivationLetter: false,
    CVMotivationEmail: false,
    CVMotivationEmailDraft: false,
  };

  constructor() {}

  /**
   * Retrieves the singleton instance.
   */
  public static getInstance(): N8NWorkflow {
    if (N8NWorkflow.instance === null) {
      N8NWorkflow.instance = new N8NWorkflow();
    }
    return N8NWorkflow.instance;
  }

  static getN8NWorkflowName(url: string): N8N_WORKFLOW_NAMES | null {
    const makeUrlToNameMapper = () => {
      return Object.values(N8N_WEBHOOKS).reduce((map, { name, url }) => {
        map[url] = name;
        return map;
      }, {} as Record<string, N8N_WORKFLOW_NAMES>);
    }
    const mapper = makeUrlToNameMapper();
    return mapper[url] ?? null;
  }

  private runGetWorkflow = async (url: string) => {
    if (!url) throw new Error(ERROR_MISSING_WEBHOOK);
    let errMsg: string | null = null;
    
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private runPostWorkflow = async (url: string, body: Record<string, any>) => {
    if (!url) throw new Error(ERROR_MISSING_WEBHOOK);
    let errMsg: string | null = null;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
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


  public startFranceTravailLoadingJobWorkflow = async ({ originalJobId }: { originalJobId: string }) => {
    const response: WorkflowResponse = { error: null };
    if (!this.started.FranceTravailLoadingJob) {
      this.started.FranceTravailLoadingJob = true;
      const { url } = N8N_WEBHOOKS.FranceTravailLoadingJob;
      const { error } = await this.runPostWorkflow(url, { id: originalJobId });
      if (error) response.error = error;
      this.started.FranceTravailLoadingJob = false;
    } else {
      response.error = 'Workflow FranceTravailLoadingJob is already running.';
    }
    return response;
  }

  public startFranceTravailGmailWorkflow = async () => {
    const response: WorkflowResponse = { error: null };
    if (!this.started.FranceTravailGmail) {
      this.started.FranceTravailGmail = true;
      const { url } = N8N_WEBHOOKS.FranceTravailGmail;
      const { error } = await this.runGetWorkflow(url);
      if (error) response.error = error;
      this.started.FranceTravailGmail = false;
    } else {
      response.error = 'Workflow FranceTravailGmail is already running.';
    }
    return response;
  }

  public startFranceTravailDataWorkflow = async ({ _id }: { _id: string }) => {
    const response: WorkflowResponse = { error: null };
    if (!this.started.FranceTravailData) {
      this.started.FranceTravailData = true;
      const { url } = N8N_WEBHOOKS.FranceTravailData;
      const { error } = await this.runPostWorkflow(url, { _id });
      if (error) response.error = error;
      this.started.FranceTravailData = false;
    } else {
      response.error = 'Workflow FranceTravailData is already running.';
    }
    return response;
  }

  public startFranceTravailAIWorkflow = async ({ _id }: { _id: string }) => {
    const response: WorkflowResponse = { error: null };
    if (!this.started.FranceTravailAI) {
      this.started.FranceTravailAI = true;
      const { url } = N8N_WEBHOOKS.FranceTravailAI;
      const { error } = await this.runPostWorkflow(url, { _id });
      if (error) response.error = error;
      this.started.FranceTravailAI = false;
    } else {
      response.error = 'Workflow FranceTravailAI is already running.';
    }
    return response;
  }

  public startLinkedInWorkflow = async () => {
    const response: WorkflowResponse = { error: null };
    if (!this.started.LinkedIn) {
      this.started.LinkedIn = true;
      const { url } = N8N_WEBHOOKS.LinkedIn;
      const { error } = await this.runGetWorkflow(url);
      if (error) response.error = error;
      this.started.LinkedIn = false;
    } else {
      response.error = 'Workflow LinkedIn is already running.';
    }
    return response;
  }

  public startCompanyDetailsWorkflow = async ({ _id }: { _id: string }) => {
    const response: WorkflowResponse = { error: null };
    if (!this.started.CompanyDetails) {
      this.started.CompanyDetails = true;
      const { url } = N8N_WEBHOOKS.CompanyDetails;
      const { error } = await this.runPostWorkflow(url, { _id });
      if (error) response.error = error;
      this.started.CompanyDetails = false;
    } else {
      response.error = `Workflow CompanyDetails is already running.`;
    }
    return response;
  }

  public startCVMotivationLetterWorkflow = async ({ jobId, cvId }: { jobId: string, cvId: string }) => {
    const response: WorkflowResponse = { error: null };
    if (!this.started.CVMotivationLetter) {
      this.started.CVMotivationLetter = true;
      const { url } = N8N_WEBHOOKS.CVMotivationLetter;
      const { error } = await this.runPostWorkflow(url, { jobId, cvId });
      if (error) response.error = error;
      this.started.CVMotivationLetter = false;
    } else {
      response.error = 'Workflow CVMotivationLetter is already running.';
    }
    return response;
  }

  public startCVMotivationEmailWorkflow = async ({ jobId, cvId }: { jobId: string, cvId: string }) => {
    const response: WorkflowResponse = { error: null };
    if (!this.started.CVMotivationEmail) {
      this.started.CVMotivationEmail = true;
      const { url } = N8N_WEBHOOKS.CVMotivationEmail;
      const { error } = await this.runPostWorkflow(url, { jobId, cvId });
      if (error) response.error = error;
      this.started.CVMotivationEmail = false;
    } else {
      response.error = 'Workflow CVMotivationEmail is already running.';
    }
    return response;
  }
}
