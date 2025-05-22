import { JobsSelectRequestProps } from '@/app/interfaces/JobsSelectRequestProps';
import { dbConnect } from '@/backend/lib/dbConnect';
import { IJob } from '@/backend/models/IJob';
import { Job } from '@/backend/models/Job';
import mongoose, { QueryOptions, UpdateQuery } from 'mongoose';
import { DatabaseConnectionError } from '@/backend/lib/errors/DatabaseError';
import { CountUnpreferencedJobsError, CreateJobError, DeleteJobError, GetAllJobsError, GetJobByIdError, UpdateJobError } from './errors/JobRepositoryError';

/**
 * Repository for Job model CRUD operations.
 * Implements Singleton pattern to ensure a unique instance.
 */
export class JobRepository {
  // Holds the singleton instance
  private static instance: JobRepository | null = null;
  private connection: typeof mongoose | null = null;

  // Private constructor to prevent direct instantiation
  private constructor() {
    // Initialize the connection
    this.connection = null;
  }

  /**
   * Retrieves the singleton instance.
   */
  public static getInstance(): JobRepository {
    if (JobRepository.instance === null) {
      JobRepository.instance = new JobRepository();
    }
    return JobRepository.instance;
  }

  private async connect(): Promise<void> {
    if (!this.connection) {
      try {
        this.connection = await dbConnect();
      } catch (error) {
        throw new DatabaseConnectionError(String(error));
      }
    }
  }

  /**
   * Count jobs without like and dislike.
   */
  public async countUnpreferencedJobs(): Promise<number> {
    if (!this.connection) await this.connect();
    let data = null;
    try {
      data = Job.countDocuments({ preference: null })
    } catch (error) {
      throw new CountUnpreferencedJobsError(String(error));
    }
    if (!data) throw new CountUnpreferencedJobsError('No data found.');
    if (typeof data !== 'number') throw new CountUnpreferencedJobsError('Bad response.');
    return data;
  }

  /**
   * Retrieves all jobs matching the optional filter.
   * @param filter - Mongoose filter query
   */
  public async getAll({ filter, limit, skip }: JobsSelectRequestProps): Promise<IJob[]> {
    if (!this.connection) await this.connect();
    
    try {
      const findFilter = filter ? filter : {};
      const query = Job.find(findFilter);
      if (limit) query.limit(limit);
      if (skip) query.skip(skip);
      return query.exec();
    } catch (error) {
      throw new GetAllJobsError(String(error));
    }
  }

  /**
   * Retrieves a job by its ID.
   * @param id - Job document ID
   */
  public async getById(id: string): Promise<IJob | null> {
    if (!this.connection) await this.connect();
    try {
      return Job.findById(id).exec();
    } catch (error) {
      throw new GetJobByIdError(String(error));
    }
  }

  /**
   * Creates a new job document.
   * @param data - Partial job data
   */
  public async create(data: Partial<IJob>): Promise<IJob> {
    if (!this.connection) await this.connect();
    try {
      const job = new Job(data);
      return job.save();
    } catch (error) {
      throw new CreateJobError(String(error));
    }
  }

  /**
   * Updates an existing job by ID.
   * @param id - Job document ID
   * @param data - Fields to update
   */
  public async update(id: string, data: UpdateQuery<IJob>): Promise<IJob | null> {
    if (!this.connection) await this.connect();
    try {
      const objectId = new mongoose.Types.ObjectId(id);
      const filter = { _id: objectId };
      const option: QueryOptions<IJob> = { new: true };
      return Job.findByIdAndUpdate(filter, data, option).exec();
    } catch (error) {
      throw new UpdateJobError(String(error));
    }
  }

  /**
   * Deletes a job document by ID.
   * @param id - Job document ID
   */
  public async delete(id: string): Promise<IJob | null> {
    if (!this.connection) await this.connect();
    try {
      return Job.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new DeleteJobError(`Delete has failed: ${String(error)}`);
    }
  }
}

// Export the singleton instance
export default JobRepository.getInstance();
