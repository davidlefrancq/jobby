import { ICV } from '@/backend/models/ICV';
import cvRepository from '@/backend/repositories/CvRepository';
import { UpdateQuery } from 'mongoose';
import { BadInputCvDataError, BadInputEmptyIdError, CreateCvError, DeleteCvError, GetCvByIdError, UpdateCvError } from './errors/CvServiceError';
import { ICvsSelectRequest } from '@/interfaces/ICvsSelectRequest';

const MSG_ERROR_PREREQUIREMENTS_NOT_MET = 'The prerequisites for the update are not met.';

class CvService {
  private static instance: CvService | null = null;
  private repo = cvRepository;

  // Private constructor prevents direct instantiation
  private constructor() {}

  /**
   * Returns the singleton instance of CvService.
   */
  public static getInstance(): CvService {
    if (CvService.instance === null) {
      CvService.instance = new CvService();
    }
    return CvService.instance;
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
    if (!id) throw new BadInputEmptyIdError(`Get: ${MSG_ERROR_PREREQUIREMENTS_NOT_MET}`);

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
      throw new BadInputCvDataError(`Create: ${MSG_ERROR_PREREQUIREMENTS_NOT_MET}`);
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
    if (!id) throw new BadInputEmptyIdError(`Update: ${MSG_ERROR_PREREQUIREMENTS_NOT_MET}`);
    if (!update || Object.keys(update).length === 0) {
      throw new BadInputCvDataError(`Update: ${MSG_ERROR_PREREQUIREMENTS_NOT_MET}`);
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
    if (!id) throw new BadInputEmptyIdError(`Delete: ${MSG_ERROR_PREREQUIREMENTS_NOT_MET}`);

    const deleted = await this.repo.delete(id);
    if (!deleted) {
      throw new DeleteCvError(id);
    }

    return true;
  }
}

// Export singleton instance
export default CvService.getInstance();