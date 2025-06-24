import sanitizeHtml from 'sanitize-html';
import { ICV } from "./ICV";
import { ICvEntity, IEducation, IExperience } from '@/types/ICvEntity';

export class CVSanitizer {

  private static sanitizeExperience(input: IExperience): IExperience {
    const sanitizedExperience: IExperience = {
      title: '',
      company: '',
      location: '',
      dateStart: null,
      dateEnd: null,
      description: '',
      isAlternance: false
    }

    if (input.title) {
      sanitizedExperience.title = sanitizeHtml(input.title, { allowedTags: [], allowedAttributes: {} });
    }

    if (input.company) {
      sanitizedExperience.company = sanitizeHtml(input.company, { allowedTags: [], allowedAttributes: {} });
    }

    if (input.location) {
      sanitizedExperience.location = sanitizeHtml(input.location, { allowedTags: [], allowedAttributes: {} });
    }

    if (input.dateStart) {
      sanitizedExperience.dateStart = new Date(input.dateStart);
    }

    if (input.dateEnd) {
      sanitizedExperience.dateEnd = new Date(input.dateEnd);
    }

    if (input.description) {
      sanitizedExperience.description = sanitizeHtml(input.description, { allowedTags: [], allowedAttributes: {} });
    }

    if (typeof input.isAlternance === 'boolean') {
      sanitizedExperience.isAlternance = input.isAlternance;
    }

    return sanitizedExperience
  }

  public static sanitiserEducation (input: IEducation): IEducation {
    const sanitizedEducation: IEducation = {
      title: '',
      institution: '',
      location: '',
      dateStart: null,
      dateEnd: null,
      description: ''
    }

    if (input.title) {
      sanitizedEducation.title = sanitizeHtml(input.title, { allowedTags: [], allowedAttributes: {} });
    }

    if (input.institution) {
      sanitizedEducation.institution = sanitizeHtml(input.institution, { allowedTags: [], allowedAttributes: {} });
    }

    if (input.location) {
      sanitizedEducation.location = sanitizeHtml(input.location, { allowedTags: [], allowedAttributes: {} });
    }

    if (input.dateStart) {
      sanitizedEducation.dateStart = new Date(input.dateStart);
    }

    if (input.dateEnd) {
      sanitizedEducation.dateEnd = new Date(input.dateEnd);
    }

    if (input.description) {
      sanitizedEducation.description = sanitizeHtml(input.description, { allowedTags: [], allowedAttributes: {} });
    }

    return sanitizedEducation;
  }

  public static partialSanitize(input: Partial<ICV>): Partial<ICV> {
    const sanitizedCV: Partial<ICV> = {};

    if (input.title) {
      sanitizedCV.title = sanitizeHtml(input.title, { allowedTags: [], allowedAttributes: {} });
    }

    if (input.first_name) {
      sanitizedCV.first_name = sanitizeHtml(input.first_name, { allowedTags: [], allowedAttributes: {} });
    }

    if (input.last_name) {
      sanitizedCV.last_name = sanitizeHtml(input.last_name, { allowedTags: [], allowedAttributes: {} });
    }

    if (input.birth_date) {
      sanitizedCV.birth_date = new Date(input.birth_date);
    }

    if (input.city) {
      sanitizedCV.city = sanitizeHtml(input.city, { allowedTags: [], allowedAttributes: {} });
    }

    if (input.country) {
      sanitizedCV.country = sanitizeHtml(input.country, { allowedTags: [], allowedAttributes: {} });
    }

    if (input.email) {
      sanitizedCV.email = sanitizeHtml(input.email, { allowedTags: [], allowedAttributes: {} });
    }

    if (input.phone) {
      sanitizedCV.phone = sanitizeHtml(input.phone, { allowedTags: [], allowedAttributes: {} });
    }

    if (input.linkedin) {
      sanitizedCV.linkedin = sanitizeHtml(input.linkedin, { allowedTags: [], allowedAttributes: {} });
    }

    if (input.github) {
      sanitizedCV.github = sanitizeHtml(input.github, { allowedTags: [], allowedAttributes: {} });
    }

    if (input.website) {
      sanitizedCV.website = sanitizeHtml(input.website, { allowedTags: [], allowedAttributes: {} });
    }

    if (typeof input.driving_license === 'boolean') {
      sanitizedCV.driving_license = input.driving_license;
    }

    if (input.experiences) {
      sanitizedCV.experiences = input.experiences.map(exp => this.sanitizeExperience(exp));
    }

    if (input.education) {
      sanitizedCV.education = input.education.map(edu => this.sanitiserEducation(edu));
    }

    if (input.skills) {
      sanitizedCV.skills = input.skills.map(skill => sanitizeHtml(skill, { allowedTags: [], allowedAttributes: {} }));
    }

    if (input.interests) {
      sanitizedCV.interests = input.interests.map(interest => sanitizeHtml(interest, { allowedTags: [], allowedAttributes: {} }));
    }

    if (input.createdAt) {
      sanitizedCV.createdAt = new Date(input.createdAt);
    }

    if (input.updatedAt) {
      sanitizedCV.updatedAt = new Date(input.updatedAt);
    }

    return sanitizedCV;
  }

  public static sanitize(input: Partial<ICV>): ICV {
    const output: Partial<ICV> = this.partialSanitize(input);

    const response: ICvEntity = {
      title: output.title || '',
      first_name: output.first_name || '',
      last_name: output.last_name || '',
      birth_date: output.birth_date || null,
      city: output.city || null,
      country: output.country || null,
      email: output.email || null,
      phone: output.phone || null,
      linkedin: output.linkedin || null,
      github: output.github || null,
      website: output.website || null,
      driving_license: output.driving_license || false,

      experiences: output.experiences || [],
      education:output.education || [],
      skills: output.skills || [],
      interests: output.interests || [],

      createdAt: output.createdAt || null,
      updatedAt: output.updatedAt || null
    }

    return response as ICV;
  }
}