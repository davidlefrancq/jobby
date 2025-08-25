export const N8N_HOME_PAGE = 'http://localhost:5678/';
export const N8N_LINKEDIN_WEBHOOK = 'http://localhost:5678/webhook/1a900821-b2b8-41d5-80c3-0e41752178e9';
export const N8N_FRANCETRAVAIL_GMAIL_WEBHOOK = 'http://localhost:5678/webhook/france-travail-gmail';
export const N8N_FRANCETRAVAIL_DATA_WEBHOOK = 'http://localhost:5678/webhook/france-travail-data';
export const N8N_FRANCETRAVAIL_AI_WEBHOOK = 'http://localhost:5678/webhook/france-travail-ai';
export const N8N_GOOGLEALERTS_WEBHOOK = 'http://localhost:5678/webhook/0486e783-1460-43ba-b5bb-54f979cb3ca7';
export const N8N_COMPANIES_DETAILS_WEBHOOK = 'http://localhost:5678/webhook/enrich-companies-details';
export const N8N_COMPANY_DETAILS_WEBHOOK = 'http://localhost:5678/webhook/enrich-company-details';
export const N8N_CV_MOTIVATION_LETTER_WEBHOOK = 'http://localhost:5678/webhook/cv-motivation-letter';
export const N8N_CV_MOTIVATION_EMAIL_WEBHOOK = 'http://localhost:5678/webhook/cv-motivation-email';
export const N8N_CV_MOTIVATION_EMAIL_DRAFT_WEBHOOK = 'http://localhost:5678/webhook/cv-motivation-email-draft';

export enum N8N_WORKFLOW_NAMES {
  LinkedIn = 'LinkedIn',
  FranceTravailGmail = 'FranceTravailGmail',
  FranceTravailData = 'FranceTravailData',
  FranceTravailAI = 'FranceTravailAI',
  GoogleAlerts = 'GoogleAlerts',
  CompaniesDetails = 'CompaniesDetails',
  CompanyDetails = 'CompanyDetails',
  CVMotivationLetter = 'CVMotivationLetter',
  CVMotivationEmail = 'CVMotivationEmail',
  CVMotivationEmailDraft = 'CVMotivationEmailDraft',
}


type N8NWebhook = {
  name: N8N_WORKFLOW_NAMES;
  url: string;
};
type N8NWebhooks = {
  LinkedIn: N8NWebhook;
  FranceTravailGmail: N8NWebhook;
  FranceTravailData: N8NWebhook;
  FranceTravailAI: N8NWebhook;
  GoogleAlerts: N8NWebhook;
  CompaniesDetails: N8NWebhook;
  CompanyDetails: N8NWebhook;
  CVMotivationLetter: N8NWebhook;
  CVMotivationEmail: N8NWebhook;
  CVMotivationEmailDraft: N8NWebhook;
};
export const N8N_WEBHOOKS: N8NWebhooks = {
  LinkedIn: {
    name: N8N_WORKFLOW_NAMES.LinkedIn,
    url: N8N_LINKEDIN_WEBHOOK
  },
  FranceTravailGmail: {
    name: N8N_WORKFLOW_NAMES.FranceTravailGmail,
    url: N8N_FRANCETRAVAIL_GMAIL_WEBHOOK
  },
  FranceTravailData: {
    name: N8N_WORKFLOW_NAMES.FranceTravailData,
    url: N8N_FRANCETRAVAIL_DATA_WEBHOOK
  },
  FranceTravailAI: {
    name: N8N_WORKFLOW_NAMES.FranceTravailAI,
    url: N8N_FRANCETRAVAIL_AI_WEBHOOK
  },
  GoogleAlerts: {
    name: N8N_WORKFLOW_NAMES.GoogleAlerts,
    url: N8N_GOOGLEALERTS_WEBHOOK
  },
  CompaniesDetails: {
    name: N8N_WORKFLOW_NAMES.CompaniesDetails,
    url: N8N_COMPANIES_DETAILS_WEBHOOK
  },
  CompanyDetails: {
    name: N8N_WORKFLOW_NAMES.CompanyDetails,
    url: N8N_COMPANY_DETAILS_WEBHOOK
  },
  CVMotivationLetter: {
    name: N8N_WORKFLOW_NAMES.CVMotivationLetter,
    url: N8N_CV_MOTIVATION_LETTER_WEBHOOK
  },
  CVMotivationEmail: {
    name: N8N_WORKFLOW_NAMES.CVMotivationEmail,
    url: N8N_CV_MOTIVATION_EMAIL_WEBHOOK
  },
  CVMotivationEmailDraft: {
    name: N8N_WORKFLOW_NAMES.CVMotivationEmailDraft,
    url: N8N_CV_MOTIVATION_EMAIL_DRAFT_WEBHOOK
  }
};