import { ICvEntity } from "@/types/ICvEntity";
import { Document, Types } from 'mongoose';

export interface ICV extends ICvEntity, Document {
  _id: Types.ObjectId;
}