import { connect } from "mongoose";
import { IMongooseCache } from "./IMongooseCache";

declare global {
// eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any
  var mongoose: any; // This must be a `var` and not a `let / const`
}

// retrieve or initialize global cache
let cached: IMongooseCache = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

/**
 * Establishes a new Mongoose connection.
 * @param uri - MongoDB connection string
 */
async function mongooseConnect(uri: string) {
  const opts = { bufferCommands: false }; // disable command buffering
  return connect(uri, opts);
}

/**
 * Returns a singleton Mongoose connection, caching in global scope.
 * Throws if MONGODB_URI env var is undefined.
 */
async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI!;
  if (!MONGODB_URI) {
    throw new Error(
      "Define MONGODB_URI in .env.local before connecting"
    );
  }

  // return cached connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // initiate connection promise once
  if (!cached.promise) {
    cached.promise = mongooseConnect(MONGODB_URI).then((mongoose) => mongoose);
  }

  try {
    // await and cache final connection
    cached.conn = await cached.promise;
  } catch (error) {
    // reset promise on failure
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default dbConnect;
