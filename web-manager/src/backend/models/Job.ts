import { Schema, model, models } from 'mongoose';
import { IJob } from './IJob';

/**
 * Salary subdocument schema.
 */
const SalarySchema = new Schema<IJob['salary']>(
  {
    currency: { type: String, required: true },
    min: { type: Number, default: null },
    max: { type: Number, default: null },
  },
  { _id: false }
);

/**
 * Main Job schema.
 */
const JobSchema = new Schema<IJob>(
  {
    company: { type: String, required: true },
    contract_type: { type: String, default: null },
    date: { type: String, required: true },
    description: { type: String, required: true },
    interest_indicator: { type: String, required: true },
    level: { type: String, default: null },
    location: { type: String, required: true },
    methodologies: { type: [String], required: true },
    preference: { type: String, default: null },
    salary: { type: SalarySchema, required: true },
    source: { type: String, required: true },
    technologies: { type: Schema.Types.Mixed, default: null },
    teleworking: { type: Boolean, required: true },
    title: { type: String, required: true },
  },
  { timestamps: true }
);

/**
 * Export Job model. Uses existing model if already compiled (Next.js HMR).
 */
export const Job = models.Job || model<IJob>('Job', JobSchema);
