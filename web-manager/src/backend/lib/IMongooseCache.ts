import { Mongoose } from "mongoose";

export interface IMongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}
