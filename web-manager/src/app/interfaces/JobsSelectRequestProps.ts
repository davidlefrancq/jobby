import { IJob } from '@/backend/models/IJob';
import { FilterQuery } from 'mongoose';

export interface JobsSelectRequestProps {
  filter?: FilterQuery<IJob>;
  limit?: number;
  skip?: number;
}
