import { IJobEntity } from "@/types/IJobEntity";
import { FilterQuery } from "mongoose";

export interface JobsSelectRequestProps {
  limit?: number;
  skip?: number;
  filter?: FilterQuery<IJobEntity>
}
