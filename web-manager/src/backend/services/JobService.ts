import { JobsSelectRequestProps } from '@/app/interfaces/JobsSelectRequestProps';
import { IJob } from '@/backend/models/IJob';
import jobRepository from '@/backend/repositories/JobRepository';
import { UpdateQuery } from 'mongoose';

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
   * Retrieves all jobs matching an optional filter.
   * @param filter - Mongoose filter query
   */
  public async listJobs(req: JobsSelectRequestProps): Promise<IJob[]> {
    return this.repo.getAll(req);
  }

  /**
   * Retrieves a job by its ID, throws if not found.
   * @param id - Job document ID
   */
  public async getJobById(id: string): Promise<IJob> {
    const job = await this.repo.getById(id);
    if (!job) {
      throw new Error(`Job with id ${id} not found`);
    }
    return job;
  }

  /**
   * Creates a new job document.
   * @param data - Partial job data
   */
  public async createJob(data: Partial<IJob>): Promise<IJob> {
    // Additional business validations can be added here
    return this.repo.create(data);
  }

  /**
   * Updates an existing job, throws if not found.
   * @param id - Job document ID
   * @param data - Fields to update
   */
  public async updateJob(id: string, data: UpdateQuery<IJob>): Promise<IJob> {
    const updated = await this.repo.update(id, data);
    if (!updated) {
      throw new Error(`Job with id ${id} not found`);
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
      throw new Error(`Job with id ${id} not found`);
    }
  }
}

// Export singleton instance
export default JobService.getInstance();
