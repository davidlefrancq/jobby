import { IJobsSelectRequest } from '@/interfaces/IJobsSelectRequest';
import { IJob } from '@/backend/models/IJob';
import jobRepository from '@/backend/repositories/JobRepository';
import { UpdateQuery } from 'mongoose';
import { CreateJobError, DeleteJobError, GetJobByIdError, UpdateJobError } from './errors/JobServiceError';

/**
 * Service layer for Job operations.
 * Encapsulates business logic and delegates data access to repository.
 * Implements Singleton pattern for a single service instance.
 */
export class JobService {
  private static instance: JobService | null = null;
  private repo = jobRepository;

  // Private constructor prevents direct instantiation
  private constructor() {}

  /**
   * Returns the singleton instance of JobService.
   */
  public static getInstance(): JobService {
    if (JobService.instance === null) {
      JobService.instance = new JobService();
    }
    return JobService.instance;
  }

  /**
   * Counts the number of unrated jobs.
   */
  public async countUnratedJobs(): Promise<number> {
    return this.repo.countUnratedJobs();
  }

  /**
   * Counts the number of liked jobs.
   */
  public async countLikedJobs(): Promise<number> {
    return this.repo.countLikedJobs();
  }

  /**
   * Counts the number of disliked jobs.
   */
  public async countDislikedJobs(): Promise<number> {
    return this.repo.countDislikedJobs();
  }

  /**
   * Retrieves all jobs matching an optional filter.
   * @param filter - Mongoose filter query
   */
  public async listJobs(req: IJobsSelectRequest): Promise<IJob[]> {
    return this.repo.getAll(req);
  }

  /**
   * Retrieves a job by its ID, throws if not found.
   * @param id - Job document ID
   */
  public async getJobById(id: string): Promise<IJob> {
    const job = await this.repo.getById(id);
    if (!job) {
      throw new GetJobByIdError(id);
    }
    return job;
  }

  /**
   * Creates a new job document.
   * @param data - Partial job data
   */
  public async createJob(data: Partial<IJob>): Promise<IJob> {
    // Additional business validations can be added here
    const newJob = await this.repo.create(data);
    if (!newJob) {
      throw new CreateJobError();
    }
    return newJob;
  }

  /**
   * Updates an existing job, throws if not found.
   * @param id - Job document ID
   * @param data - Fields to update
   */
  public async updateJob(id: string, data: UpdateQuery<IJob>): Promise<IJob> {
    const updated = await this.repo.update(id, data);
    if (!updated) {
      throw new UpdateJobError(id);
    }
    return updated;
  }

  /**
   * Deletes a job by its ID, throws if not found.
   * @param id - Job document ID
   */
  public async deleteJob(id: string): Promise<void> {
    const deleted = await this.repo.delete(id);
    if (!deleted) {
      throw new DeleteJobError(id);
    }
  }
}

// Export singleton instance
export default JobService.getInstance();
