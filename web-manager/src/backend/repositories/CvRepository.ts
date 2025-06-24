import mongoose, { FilterQuery } from 'mongoose';
import { MongoConnection } from '../lib/dbConnect';
import { DatabaseConnectionError } from '../lib/errors/DatabaseError';
import { ICvEntity } from '@/types/ICvEntity';
import { CV } from '../models/CV';
import { ICV } from '../models/ICV';
import { CVSanitizer } from '../models/CVSanitizer';
import { CreateCvError, DeleteCvError, GetAllCvsError, GetCvByIdError, UpdateCvError } from './errors/CvRepositoryError';
import { ICvsSelectRequest } from '@/interfaces/ICvsSelectRequest';
import { IMongoDbParams } from '../interfaces/IMongoDbParams';

export class CvRepository {
  // Holds the singleton instance
  private static instance: CvRepository | null = null;
  private mongoConnection: MongoConnection | null = null;
  private connection: typeof mongoose | null = null;
  private dbUri: string;
  
  private constructor({ dbUri }: IMongoDbParams) {
    if (!dbUri) throw new DatabaseConnectionError('Database URI is required to create CvRepository instance.');
    this.dbUri = dbUri;
    this.mongoConnection = MongoConnection.getInstance({ uri: dbUri });
  }

  /**
   * Retrieves the singleton instance.
   */
  public static getInstance({ dbUri }: IMongoDbParams): CvRepository {
    if (CvRepository.instance === null) {
      if (!dbUri) throw new DatabaseConnectionError('Database URI is required to create CvRepository instance.');
      CvRepository.instance = new CvRepository({ dbUri });
    }
    return CvRepository.instance;
  }

  private async connect(): Promise<void> {
    if (!this.connection) {
      if (!this.dbUri) throw new DatabaseConnectionError('Database URI is required.');
      try {
        if (!this.mongoConnection) this.mongoConnection = MongoConnection.getInstance({ uri: this.dbUri });
        this.connection = await this.mongoConnection.connect();
      } catch (error) {
        throw new DatabaseConnectionError(String(error));
      }
    }
  }

  /**
   * Counts all CVs based on an optional filter.
   * @param filter - Optional filter for counting
   */
  public async count(filter?: FilterQuery<ICvEntity>): Promise<number> {
    if (!this.connection) await this.connect();
    let count: number = 0;
    try {
      const findFilter: mongoose.FilterQuery<ICvEntity> = filter ? filter : {};
      count = await CV.countDocuments(findFilter).exec();
    } catch (error) {
      throw new GetAllCvsError(String(error));
    }
    return count;
  }

  public async getAll({ filter, limit, skip }: ICvsSelectRequest): Promise<ICV[]> {
    if (!this.connection) await this.connect();

    let data: ICV[] = [];
    try {
      const findFilter: mongoose.FilterQuery<ICvEntity> = filter ? filter : {};
      const query = CV.find(findFilter);
      if (limit) query.limit(limit);
      if (skip) query.skip(skip);
      const response = await query.exec();
      if (response && response.length > 0) {
        data = response
      }
    } catch (error) {
      throw new GetAllCvsError(String(error));
    }
    
    return data;
  }

  public async getById(id: string): Promise<ICV | null> {
    if (!this.connection) await this.connect();

    let data: ICV | null = null;
    try {
      const query = CV.findById(id);
      const response = await query.exec();
      if (response && response._id) {
        data = response;
      }
    } catch (error) {
      throw new GetCvByIdError(String(error));
    }

    return data;
  }

  public async create(data: Partial<ICV>): Promise<ICV> {
    if (!this.connection) await this.connect();

    try {
      const sanitizedData = CVSanitizer.sanitize(data);
      const newCv = new CV(sanitizedData);

      // Validate the CV before saving
      const validationError = newCv.validateSync();
      if (validationError) {
        throw new CreateCvError(`Validation error: ${String(validationError)}`);
      }

      // Dates
      const createAt = new Date();
      if (!newCv.created_at) newCv.created_at = createAt;
      if (!newCv.updated_at) newCv.updated_at = createAt;

      return newCv.save();
    } catch (error) {
      throw new CreateCvError(String(error));
    }
  }

  public async update(id: string, data: Partial<ICV>): Promise<ICV | null> {
    if (!this.connection) await this.connect();

    try {
      const sanitizedData = CVSanitizer.sanitize(data);
      sanitizedData.updated_at = new Date();

      const updatedCv = await CV.findByIdAndUpdate(id, sanitizedData, { new: true }).exec();
      return updatedCv;
    } catch (error) {
      throw new UpdateCvError(String(error));
    }
  }

  public async delete(id: string): Promise<ICV | null> {
    if (!this.connection) await this.connect();

    try {
      const deletedCv = await CV.findByIdAndDelete(id).exec();
      return deletedCv;
    } catch (error) {
      throw new DeleteCvError(String(error));
    }
  }

  public async destroy(): Promise<void> {
    if (this.connection) {
      await this.connection.disconnect();
      this.connection = null;
      CvRepository.instance = null;
    }
  }
}