import { IJobEntity } from '@/types/IJobEntity';
import { Document, Types } from 'mongoose';

/**
 * Interface representing a Job document in MongoDB.
 */
export interface IJob extends IJobEntity, Document {
  _id: Types.ObjectId;
}