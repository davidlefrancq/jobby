import { ICvEntity } from "@/types/ICvEntity";
import { FilterQuery } from "mongoose";

export interface ICvsSelectRequest {
  limit?: number;
  skip?: number;
  filter?: FilterQuery<ICvEntity>
}