import { JobsSelectRequestProps } from '@/app/interfaces/JobsSelectRequestProps';
import { dbConnect } from '@/backend/lib/dbConnect';
import { IJob } from '@/backend/models/IJob';
import { Job } from '@/backend/models/Job';
import mongoose, { UpdateQuery } from 'mongoose';

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

  /**
   * Retrieves all jobs matching the optional filter.
   * @param filter - Mongoose filter query
   */
  public async getAll({ filter, limit, skip }: JobsSelectRequestProps): Promise<IJob[]> {
    if (!this.connection) this.connection = await dbConnect();
    
    if (!filter) filter = {};
    const query = Job.find(filter)
    if (limit) query.limit(limit);
    if (skip) query.skip(skip);
    return query.exec();
  }

  /**
   * Retrieves a job by its ID.
   * @param id - Job document ID
   */
  public async getById(id: string): Promise<IJob | null> {
    if (!this.connection) this.connection = await dbConnect();
    return Job.findById(id).exec();
  }

  /**
   * Creates a new job document.
   * @param data - Partial job data
   */
  public async create(data: Partial<IJob>): Promise<IJob> {
    if (!this.connection) this.connection = await dbConnect();
    const job = new Job(data);
    return job.save();
  }

  /**
   * Updates an existing job by ID.
   * @param id - Job document ID
   * @param data - Fields to update
   */
  public async update(id: string, data: UpdateQuery<IJob>): Promise<IJob | null> {
    if (!this.connection) this.connection = await dbConnect();
    return Job.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  /**
   * Deletes a job document by ID.
   * @param id - Job document ID
   */
  public async delete(id: string): Promise<IJob | null> {
    if (!this.connection) this.connection = await dbConnect();
    return Job.findByIdAndDelete(id).exec();
  }
}

// Export the singleton instance
export default JobRepository.getInstance();
