import { Types } from 'mongoose';

export type JobPreference = 'like' | 'dislike' | null;

export interface IJobEntity {
  _id: Types.ObjectId;
  company: string;
  contract_type?: string | null;
  date: string | null;
  description: string | null;
  interest_indicator: string;
  level?: string | null;
  location: string | null;
  methodologies: string[] | null;
  preference: JobPreference;
  language: string | null;
  salary: {
    currency: string;
    min?: number | null;
    max?: number | null;
  };
  source: string;
  technologies: string[] | null;
  teleworking: boolean;
  title: string;
}