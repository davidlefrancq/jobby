import { Types } from 'mongoose';

export interface IJobEntity {
  _id: Types.ObjectId;
  company: string;
  contract_type?: string | null;
  date: string;
  description: string;
  interest_indicator: string;
  level?: string | null;
  location: string;
  methodology: string[];
  salary: {
    currency: string;
    min?: number | null;
    max?: number | null;
  };
  source: string;
  technologues: null;
  teleworking: boolean;
  title: string;
}