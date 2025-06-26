import { ICV } from '@/backend/models/ICV';
import { CvRepository } from '@/backend/repositories/CvRepository';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { BadInputCvDataError, BadInputJobEmptyIdError, CreateCvError, CvServiceBadDbUriError, DeleteCvError, GetCvByIdError, UpdateCvError } from './errors/CvServiceError';
import { ICvsSelectRequest } from '@/interfaces/ICvsSelectRequest';
import { IMongoDbParams } from '../interfaces/IMongoDbParams';
import { ICvEntity } from '@/types/ICvEntity';

export class CvService {
  private static instance: CvService | null = null;
  private repo: CvRepository;

  // Private constructor prevents direct instantiation
  private constructor({ dbUri }: IMongoDbParams) {
    if (!dbUri) {
      throw new CvServiceBadDbUriError('Database URI is required to initialize CvService.');
    }

    this.repo = CvRepository.getInstance({ dbUri });
  }

  /**
   * Returns the singleton instance of CvService.
   */
  public static getInstance({ dbUri }: IMongoDbParams): CvService {
    if (!dbUri) {
      throw new CvServiceBadDbUriError('Database URI is required to get CvService instance.');
    }

    if (!CvService.instance) {
      CvService.instance = new CvService({ dbUri });
    }

    return CvService.instance;
  }

  /**
   * Counts all CVs.
   * @param filter - Optional filter for counting
   */
  public async countCvs(filter?: FilterQuery<ICvEntity>): Promise<number> {
    if (!this.repo) throw new CvServiceBadDbUriError('CvRepository is not initialized.');
    return this.repo.count(filter);
  }

  /**
   * Retrieves all CVs.
   */
  public async listCvs(req: ICvsSelectRequest): Promise<ICV[]> {
    return this.repo.getAll(req);
  }

  /**
   * Retrieves a CV by its ID, throws if not found.
   * @param id - CV document ID
   */
  public async getCvById(id: string): Promise<ICV> {
    if (!id) throw new BadInputJobEmptyIdError(`Get: The prerequisites for the update are not met.`);

    const cv = await this.repo.getById(id);
    if (!cv) throw new GetCvByIdError(id);
    return cv;
  }

  /**
   * Creates a new CV.
   * @param cvData - CV data to create
   */
  public async createCv(cvData: Partial<ICV>): Promise<ICV> {
    if (!cvData || Object.keys(cvData).length === 0) {
      throw new BadInputCvDataError(`Create: The prerequisites for the update are not met.`);
    }

    const newCv = await this.repo.create(cvData);
    if (!newCv) {
      throw new CreateCvError();
    }
    return newCv;
  }

  /**
   * Updates a CV by its ID.
   * @param id - CV document ID
   * @param update - Update query object
   */
  public async updateCv(id: string, update: UpdateQuery<ICV>): Promise<ICV | null> {
    if (!id) throw new BadInputJobEmptyIdError(`Update: The prerequisites for the update are not met.`);
    if (!update || Object.keys(update).length === 0) {
      throw new BadInputCvDataError(`Update: The prerequisites for the update are not met.`);
    }

    const updatedCv = await this.repo.update(id, update);
    if (!updatedCv) {
      throw new UpdateCvError(id);
    }
    return updatedCv;
  }

  /**
   * Deletes a CV by its ID.
   * @param id - CV document ID
   */
  public async deleteCv(id: string): Promise<boolean> {
    if (!id) throw new BadInputJobEmptyIdError(`Delete: The prerequisites for the update are not met.`);

    const deleted = await this.repo.delete(id);
    if (!deleted) {
      throw new DeleteCvError(id);
    }

    return true;
  }

  public async destroy(): Promise<void> {
    await this.repo.destroy();
    CvService.instance = null;
  }
}