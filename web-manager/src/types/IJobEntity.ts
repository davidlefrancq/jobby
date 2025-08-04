import { Types } from "mongoose";

export const JOB_LIKED = 'like';
export const JOB_DISLIKED = 'dislike';
export type JobPreference = 'like' | 'dislike' | null;

export interface ISalary {
  currency: string | null;
  min: number | null;
  max: number | null;
}

export interface ICompanyLocation {
  address?: string | null;
  city?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  postal_code?: string | null;
  siret?: string | null;
  workforce?: number | null;
}

export interface ICompanyShareCapital {
  amount: number;
  currency: string | null;
}

export interface ICompanyCA {
  amount: number | null;
  currency: string | null;
  siret: string;
  year: number | null;
}

export interface ICompanyLeadership {
  email: string | null;
  github: string | null;
  linkedin: string | null;
  name: string | null;
  phone: string | null;
  position: string | null;
  twitter: string | null;
  website: string | null;
}

export interface ICompanyMarketPositioning {
  competitors: string[] | null;
  differentiators: string[] | null;
}

export interface ICompanyNafApe {
  code: string | null;
  activity: string | null;
}

export interface ICompanyDetails {
  clients: string[] | null;
  creation_date: Date | null;
  description: string | null;
  global_workforce: number | null;
  leadership: ICompanyLeadership[] | null;
  legal_form: string | null;
  locations: ICompanyLocation[] | null;
  logo: string | null;
  market_positioning: ICompanyMarketPositioning | null;  
  products: string[] | null;
  revenue: ICompanyCA[] | null;
  sector: string | null;
  share_capital: ICompanyShareCapital | null;
  siren: string | null;
  naf_ape: ICompanyNafApe | null;
  website: string | null;
}

export interface IJobEntity {
  _id?: Types.ObjectId;
  abstract: string | null;
  collective_agreement: string | null;
  company: string | null;
  company_details: ICompanyDetails | null;
  content: string | null;
  contract_type: string | null;
  cv_id: string | null;
  date: string | null;
  description: string | null;
  interest_indicator: string | null;
  language: string | null;
  level: string | null;
  location: string | null;
  metadata: string | null;
  methodologies: string[] | null;
  motivation_letter: string | null;
  motivation_email: string | null;
  motivation_email_subject: string | null;
  motivation_email_to: string | null;
  motivation_email_draft_url: string | null;
  original_job_id: string | null;
  original_mail_id: string | null;
  preference: JobPreference | null;
  processing_stage: string | null; // Read ProcessingStage type to see different values
  salary: ISalary | null;
  source: string | null;
  technologies: string[] | null;
  teleworking: boolean;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
}