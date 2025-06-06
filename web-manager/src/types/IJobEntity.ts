import { Types } from "mongoose";

export type JobPreference = 'like' | 'dislike' | null;

export interface ISalary {
  currency: string;
  min?: number | null;
  max?: number | null;
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
  creation_date: Date | null;sector?: string | null;
  description: string | null;
  global_workforce: number | null;
  leadership: ICompanyLeadership[] | null;
  legal_form: string | null;
  locations: ICompanyLocation[] | null;
  logo: string | null;
  market_positioning: ICompanyMarketPositioning | null;  
  products: string[] | null;
  revenue: ICompanyCA[] | null;
  share_capital: ICompanyShareCapital | null;
  siren: string | null;
  naf_ape: ICompanyNafApe | null;
  website: string | null;
}

export interface IJobEntity {
  _id?: Types.ObjectId;
  collective_agreement: string | null;
  company: string | null;
  company_details: ICompanyDetails | null;
  contract_type: string | null;
  date: string | null;
  description: string | null;
  interest_indicator: string | null;
  language: string | null;
  level: string | null;
  location: string | null;
  methodologies: string[] | null;
  original_job_id: string | null;
  preference: JobPreference | null;
  salary: ISalary | null;
  source: string | null;
  technologies: string[] | null;
  teleworking: boolean;
  title: string;
  created_at: Date | null;
  updated_at: Date | null;
}