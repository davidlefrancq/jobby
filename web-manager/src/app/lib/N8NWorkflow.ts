import {
  N8N_WORKFLOW_NAMES,
  N8N_WEBHOOKS,
} from "@/constants/n8n-webhooks";

const ERROR_MISSING_WEBHOOK = 'Missing webhook URL.';
const ERROR_UNKNOWN_WORKFLOW = 'Unknown workflow.';
const ERROR_WORKFLOW_EXECUTION = 'Error executing workflow.';
const ERROR_WORKFLOW_EXECUTION_DETAILS = `${ERROR_WORKFLOW_EXECUTION} Details:`;

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
    FranceTravail: false,
    GoogleAlerts: false,
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

  private runWorkflow = async (url: string) => {
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

  private startFrancetTravailWorkflow = async () => {
    const response: WorkflowResponse = { error: null };
    if (!this.started.FranceTravail) {
      this.started.FranceTravail = true;
      const { url } = N8N_WEBHOOKS.FranceTravail;
      const { error } = await this.runWorkflow(url);
      if (error) response.error = error;
      this.started.FranceTravail = false;
    }
    return response;
  }

  private startGoogleAlertsWorkflow = async () => {
    const response: WorkflowResponse = { error: null };
    if (!this.started.GoogleAlerts) {
      this.started.GoogleAlerts = true;
      const { url } = N8N_WEBHOOKS.GoogleAlerts;
      const { error } = await this.runWorkflow(url);
      if (error) response.error = error;
      this.started.GoogleAlerts = false;
    }
    return response;
  }

  private startLinkedInWorkflow = async () => {
    const response: WorkflowResponse = { error: null };
    if (!this.started.LinkedIn) {
      this.started.LinkedIn = true;
      const { url } = N8N_WEBHOOKS.LinkedIn;
      const { error } = await this.runWorkflow(url);
      if (error) response.error = error;
      this.started.LinkedIn = false;
    }
    return response;
  }

  private startCompaniesDetailsWorkflow = async () => {
    const response: WorkflowResponse = { error: null };
    if (!this.started.CompaniesDetails) {
      this.started.CompaniesDetails = true;
      const { url } = N8N_WEBHOOKS.CompaniesDetails;
      const { error } = await this.runWorkflow(url);
      if (error) response.error = error;
      this.started.CompaniesDetails = false;
    }
    return response;
  }

  public startCompanyDetailsWorkflow = async ({ _id }: { _id: string }) => {
    const response: WorkflowResponse = { error: null };
    if (!this.started.CompanyDetails) {
      this.started.CompanyDetails = true;
      const { url } = N8N_WEBHOOKS.CompanyDetails;
      const res = await fetch(
        url,
        {
          method: 'POST',
          body: JSON.stringify({ _id })
        }
      );
      let error: string | null = null;
      if (!res.ok) error = `Error ${res.status}: ${res.statusText}`;
      if (error) response.error = error;
      this.started.CompanyDetails = false;
    }
    return response;
  }

  public startCVMotivationLetterWorkflow = async ({ jobId, cvId }: { jobId: string, cvId: string }) => {
    const response: WorkflowResponse = { error: null };
    if (!this.started.CVMotivationLetter) {
      this.started.CVMotivationLetter = true;
      const { url } = N8N_WEBHOOKS.CVMotivationLetter;
      const res = await fetch(
        url,
        {
          method: 'POST',
          body: JSON.stringify({ jobId, cvId })
        }
      );
      let error: string | null = null;
      if (!res.ok) error = `Error ${res.status}: ${res.statusText}`;
      if (error) response.error = error;
      this.started.CVMotivationLetter = false;
    }
    return response;
  }

  public startCVMotivationEmailWorkflow = async ({ jobId, cvId }: { jobId: string, cvId: string }) => {
    const response: WorkflowResponse = { error: null };
    if (!this.started.CVMotivationEmail) {
      this.started.CVMotivationEmail = true;
      const { url } = N8N_WEBHOOKS.CVMotivationEmail;
      const res = await fetch(
        url,
        {
          method: 'POST',
          body: JSON.stringify({ jobId, cvId })
        }
      );
      let error: string | null = null;
      if (!res.ok) error = `Error ${res.status}: ${res.statusText}`;
      if (error) response.error = error;
      this.started.CVMotivationEmail = false;
    }
    return response;
  }

  public startCVMotivationEmailDraftWorkflow = async ({ jobId, cvId }: { jobId: string, cvId: string }) => {
    const response: WorkflowResponse = { error: null };
    if (!this.started.CVMotivationEmailDraft) {
      this.started.CVMotivationEmailDraft = true;
      const { url } = N8N_WEBHOOKS.CVMotivationEmailDraft;
      const res = await fetch(
        url,
        {
          method: 'POST',
          body: JSON.stringify({ jobId, cvId })
        }
      );
      let error: string | null = null;
      if (!res.ok) error = `Error ${res.status}: ${res.statusText}`;
      if (error) response.error = error;
      this.started.CVMotivationEmailDraft = false;
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
        case N8N_WORKFLOW_NAMES.CompaniesDetails:
          const cdResponse = await this.startCompaniesDetailsWorkflow();
          if (cdResponse.error) setError(cdResponse.error);
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
