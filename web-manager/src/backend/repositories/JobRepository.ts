import { JobsSelectRequestProps } from '@/app/interfaces/JobsSelectRequestProps';
import { dbConnect } from '@/backend/lib/dbConnect';
import { IJob } from '@/backend/models/IJob';
import { Job } from '@/backend/models/Job';
import mongoose, { QueryOptions, UpdateQuery } from 'mongoose';

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

  private stringToRegex(str: string): RegExp {
    const keywords = str.trim().split(/\s+/);
    return new RegExp(keywords.map((keyword) => `\\b${keyword}\\b`).join('|'), 'i');
  }

  /**
   * Retrieves all jobs matching the optional filter.
   * @param filter - Mongoose filter query
   */
  public async getAll({ filter, limit, skip }: JobsSelectRequestProps): Promise<IJob[]> {
    if (!this.connection) this.connection = await dbConnect();
    
    let findFilter = {};
    if (filter) {
      if (filter.title) {
        const titleRegex = this.stringToRegex(filter.title);
        findFilter = {...findFilter, title: { $regex: titleRegex } };
      }
      if (filter.company) {
        const companyRegex = this.stringToRegex(filter.company);
        findFilter = {...findFilter, company: { $regex: companyRegex } };
      }
      if (filter.location) {
        const locationRegex = this.stringToRegex(filter.location);
        findFilter = {...findFilter, location: { $regex: locationRegex } };
      }
      if (filter.type) {
        const typeRegex = this.stringToRegex(filter.type);
        findFilter = {...findFilter, type: { $regex: typeRegex } };
      }
      if (filter.contract_type) {
        const contractTypeRegex = this.stringToRegex(filter.contract_type);
        findFilter = {...findFilter, contract_type: { $regex: contractTypeRegex } };
      }
      if (filter.interest_indicator) {
        const interestIndicatorRegex = this.stringToRegex(filter.interest_indicator);
        findFilter = {...findFilter, interest_indicator: { $regex: interestIndicatorRegex } };
      }
      if (filter.salary) throw new Error('Salary filter is not implemented yet.');
      if (filter.date) throw new Error('Date filter is not implemented yet.');
      if (filter.description) throw new Error('Description filter is not implemented yet.');
    }
    const query = Job.find(findFilter);
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
    try {
    if (!this.connection) this.connection = await dbConnect();
    const objectId = new mongoose.Types.ObjectId(id);
    const filter = { _id: objectId };
    const option: QueryOptions<IJob> = { new: true };
    return Job.findByIdAndUpdate(filter, data, option).exec();
    } catch (error) {
      console.error('Error updating job:', error);
      throw new Error(`Failed to update job with ID ${id}`);
    }
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
