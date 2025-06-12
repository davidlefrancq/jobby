import mongoose from 'mongoose';
import { dbConnect } from '../lib/dbConnect';
import { DatabaseConnectionError } from '../lib/errors/DatabaseError';
import { ICvEntity } from '@/types/ICvEntity';
import { CV } from '../models/CV';
import { ICV } from '../models/ICV';
import { CVSanitizer } from '../models/CVSanitizer';
import { CreateCvError, DeleteCvError, GetAllCvsError, GetCvByIdError, UpdateCvError } from './errors/CvRepositoryError';
import { ICvsSelectRequest } from '@/interfaces/ICvsSelectRequest';

class CvRepository {
  // Holds the singleton instance
  private static instance: CvRepository | null = null;
  private connection: typeof mongoose | null = null;
  
  private constructor() {}

  /**
   * Retrieves the singleton instance.
   */
  public static getInstance(): CvRepository {
    if (CvRepository.instance === null) {
      CvRepository.instance = new CvRepository();
    }
    return CvRepository.instance;
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

      return newCv.save();
    } catch (error) {
      throw new CreateCvError(String(error));
    }
  }

  public async update(id: string, data: Partial<ICV>): Promise<ICV | null> {
    if (!this.connection) await this.connect();

    try {
      const sanitizedData = CVSanitizer.sanitize(data);
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
}

// Export the singleton instance
export default CvRepository.getInstance();