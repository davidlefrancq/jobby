import { Types } from "mongoose";

export interface IExperience {
  title: string;
  company: string;
  location: string;
  dateStart: Date | null;
  dateEnd: Date | null;
  description: string;
  isAlternance: boolean;
}

export interface IEducation {
  title: string;
  institution: string;
  location: string;
  dateStart: Date | null;
  dateEnd: Date | null;
  description: string;
}

export interface ICvEntity {
  _id?: Types.ObjectId;
  title: string;
  first_name: string;
  last_name: string;
  birth_date: Date | null;
  city: string | null;
  country: string | null;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  github: string | null;
  website: string | null;
  driving_license: boolean;
  
  experiences: IExperience[];
  education: IEducation[];
  skills: string[]; // liste libre sans doublon
  interests: string[];

  createdAt?: Date;
  updatedAt?: Date;
}