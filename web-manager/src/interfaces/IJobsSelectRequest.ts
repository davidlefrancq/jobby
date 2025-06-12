import { IJobEntity } from "@/types/IJobEntity";
import { FilterQuery } from "mongoose";

export interface IJobsSelectRequest {
  limit?: number;
  skip?: number;
  filter?: FilterQuery<IJobEntity>
}
