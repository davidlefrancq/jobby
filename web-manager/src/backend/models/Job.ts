import { Schema, model, models } from 'mongoose';
import { IJob } from './IJob';
import { ICompanyCA, ICompanyDetails, ICompanyLeadership, ICompanyLocation, ICompanyMarketPositioning, ICompanyNafApe, ICompanyShareCapital, ISalary } from '@/types/IJobEntity';

/**
 * Salary subdocument schema.
 */
const SalarySchema = new Schema<ISalary>(
  {
    currency: { type: String, default: null },
    min: { type: Number, default: null },
    max: { type: Number, default: null },
  },
  { _id: false }
);

/** Company location */
const CompanyLocationSchema = new Schema<ICompanyLocation>(
  {
    address: { type: String, default: null },
    city: { type: String, default: null },
    country: { type: String, default: null },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    postal_code: { type: String, default: null },
    siret: { type: String, default: null },
    workforce: { type: Number, default: null },
  },
  { _id : false }
);

/** Company leadership */
const CompanyLeadershipSchema = new Schema<ICompanyLeadership>(
  {
    email: { type: String, default: null },
    github: { type: String, default: null },
    linkedin: { type: String, default: null },
    name: { type: String, required: true },
    phone: { type: String, default: null },
    position: { type: String, default: null },
    twitter: { type: String, default: null },
    website: { type: String, default: null },
  },
  { _id : false }
);

/** Company market positioning */
const CompanyMarketPositioningSchema = new Schema<ICompanyMarketPositioning>(
  {
    competitors: { type: [String], default: null },
    differentiators: { type: [String], default: null },
  },
  { _id: false }
);

/** Company revenue */
const CompanyRevenueSchema = new Schema<ICompanyCA>(
  {
    amount: { type: Number, default: null },
    currency: { type: String, default: null },
    siret: { type: String, default: null },
    year: { type: Number, default: null },
  },
  { _id: false }
);


/** Company share capital */
const CompanyShareCapitalSchema = new Schema<ICompanyShareCapital>(
  {
    amount: { type: Number, required: true },
    currency: { type: String, default: '' },
  },
  { _id: false }
);

/** Company NAF/APE */
const NafApeSchema = new Schema<ICompanyNafApe>({
  code: { type: String, default: null },
  activity: { type: String, default: null },
}, { _id: false });

/**
 * Company details subdocument schema.
 */
const CompanyDetailsSchema = new Schema<ICompanyDetails>(
  {
    clients: { type: [String], default: null },
    creation_date: { type: Date, default: null },
    description: { type: String, default: null },
    global_workforce: { type: Number, default: null },
    leadership: { type: [CompanyLeadershipSchema], default: null },
    legal_form: { type: String, default: null },
    locations: { type: [CompanyLocationSchema], default: null },
    logo: { type: String, default: null },
    market_positioning: { type: CompanyMarketPositioningSchema, default: null },
    products: { type: [String], default: null },
    revenue: { type: [CompanyRevenueSchema], default: null },
    share_capital: { type: CompanyShareCapitalSchema, default: null },
    siren: { type: String, default: null },
    naf_ape: { type: NafApeSchema, default: null },
    website: { type: String, default: null },
  },
  { _id : false }
);

/**
 * Main Job schema.
 */
const JobSchema = new Schema<IJob>(
  {
    collective_agreement: { type: String, default: null },
    company: { type: String, default: null },
    company_details: { type: CompanyDetailsSchema, default: null },
    contract_type: { type: String, default: null },
    date: { type: String, default: null },
    description: { type: String, default: null },
    interest_indicator: { type: String, default: null },
    level: { type: String, default: null },
    language: { type: String, default: null },
    location: { type: String, default: null },
    methodologies: { type: [String], required: true },
    preference: { type: String, default: null },
    salary: { type: SalarySchema, default: null },
    source: { type: String, default: null },
    technologies: { type: Schema.Types.Mixed, default: null },
    teleworking: { type: Boolean, default: false },
    title: { type: String, default: 'unknown' },
    original_job_id: { type: String, default: null },
    created_at: { type: Date, default: new Date() },
    updated_at: { type: Date, default: new Date() },
  },
  { timestamps: true }
);

/**
 * Export Job model. Uses existing model if already compiled (Next.js HMR).
 */
export const Job = models['Job']<IJob> || model<IJob>('Job', JobSchema);
