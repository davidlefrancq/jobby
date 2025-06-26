import { IJobsSelectRequest } from '@/interfaces/IJobsSelectRequest';
import { IJob } from '@/backend/models/IJob';
import { JobRepository } from '@/backend/repositories/JobRepository';
import { UpdateQuery } from 'mongoose';
import { BadInputCvEmptyIdError, CreateJobError, DeleteJobError, GetJobByIdError, JobServiceBadDbUriError, JobServiceRepositoryNotInitializedError, UpdateJobError } from './errors/JobServiceError';
import { IMongoDbParams } from '../interfaces/IMongoDbParams';

/**
 * Service layer for Job operations.
 * Encapsulates business logic and delegates data access to repository.
 * Implements Singleton pattern for a single service instance.
 */
export class JobService {
  private static instance: JobService | null = null;
  private repo: JobRepository | null = null;

  // Private constructor prevents direct instantiation
  private constructor({ dbUri }: IMongoDbParams) {
    if (!dbUri) {
      throw new JobServiceBadDbUriError('Database URI is required to initialize JobService.');
    }

    this.repo = JobRepository.getInstance({ dbUri });
  }

  /**
   * Returns the singleton instance of JobService.
   */
  public static getInstance({ dbUri }: IMongoDbParams): JobService {
    if (!dbUri) {
      throw new JobServiceBadDbUriError('Database URI is required to get JobService instance.');
    }

    if (!JobService.instance) {
      JobService.instance = new JobService({ dbUri });
    }
    return JobService.instance;
  }

  /**
   * Counts the number of unrated jobs.
   */
  public async countUnratedJobs(): Promise<number> {
    if (!this.repo) throw new JobServiceRepositoryNotInitializedError();
    return this.repo.countUnratedJobs();
  }

  /**
   * Counts the number of liked jobs.
   */
  public async countLikedJobs(): Promise<number> {
    if (!this.repo) throw new JobServiceRepositoryNotInitializedError();
    return this.repo.countLikedJobs();
  }

  /**
   * Counts the number of disliked jobs.
   */
  public async countDislikedJobs(): Promise<number> {
    if (!this.repo) throw new JobServiceRepositoryNotInitializedError();
    return this.repo.countDislikedJobs();
  }

  /**
   * Retrieves all jobs matching an optional filter.
   * @param filter - Mongoose filter query
   */
  public async listJobs(req: IJobsSelectRequest): Promise<IJob[]> {
    if (!this.repo) throw new JobServiceRepositoryNotInitializedError();
    return this.repo.getAll(req);
  }

  /**
   * Retrieves a job by its ID, throws if not found.
   * @param id - Job document ID
   */
  public async getJobById(id: string): Promise<IJob> {
    if (!this.repo) throw new JobServiceRepositoryNotInitializedError();
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
    if (!this.repo) throw new JobServiceRepositoryNotInitializedError();
    
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
    if (!this.repo) throw new JobServiceRepositoryNotInitializedError();

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
  public async deleteJob(id: string): Promise<boolean> {
    if (!id) throw new BadInputCvEmptyIdError(id);
    if (!this.repo) throw new JobServiceRepositoryNotInitializedError();

    const deleted = await this.repo.delete(id);
    if (!deleted) {
      throw new DeleteJobError(id);
    }

    return true;
  }

  public async destroy(): Promise<void> {
    if (!this.repo) throw new JobServiceRepositoryNotInitializedError();

    await this.repo.destroy();
    this.repo = null;
    JobService.instance = null;
  }
}