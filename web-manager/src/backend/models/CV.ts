import { Schema, model, models } from 'mongoose';
import { ICV } from "./ICV";
import { IEducation, IExperience } from '@/types/ICvEntity';

const ExperienceSchema = new Schema<IExperience>(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    dateStart: { type: Date, default: null },
    dateEnd: { type: Date, default: null },
    description: { type: String, required: true },
    isAlternance: { type: Boolean, default: false },
  },
  { _id: false }
);

const EducationSchema = new Schema<IEducation>(
  {
    title: { type: String, required: true },
    institution: { type: String, required: true },
    location: { type: String, required: true },
    dateStart: { type: Date, default: null },
    dateEnd: { type: Date, default: null },
    description: { type: String, required: true },
  },
  { _id: false }
);

const CvSchema = new Schema<ICV>( 
    {
    title: { type: String, required: true },
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    birth_date: { type: Date, default: null },
    city: { type: String, default: null },
    country: { type: String, default: null },
    email: { type: String, default: null },
    phone: { type: String, default: null },
    linkedin: { type: String, default: null },
    github: { type: String, default: null },
    website: { type: String, default: null },
    driving_license: { type: Boolean, default: false },

    experiences: { type: [ExperienceSchema], default: [] },
    education: { type: [EducationSchema], default: [] },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },

    createdAt: { type: Date, default: null },
    updatedAt: { type: Date, default: null },
  },
  {
    collection: "curriculum_vitaes",
    timestamps: true,
  }
)

CvSchema.virtual('fullName').get(function (this: ICV) {
  return `${this.first_name} ${this.last_name}`;
});

/**
 * Export CV model. Uses existing model if already compiled (Next.js HMR).
 */
export const CV = models['CV']<ICV> || model<ICV>('CV', CvSchema);
