import mongoose, { ConnectOptions } from "mongoose";
import {
  DatabaseCollectionError,
  DatabaseConnectionError,
  DatabaseDisconnectError,
  DatabaseEmptyUriError,
  DatabaseNoConnectionError
} from "./errors/DatabaseError";

const MONGODB_URI = process.env.MONGODB_URI || "";

/**
 * Singleton class managing Mongoose connection.
 */
export class MongoConnection {
  private static instance: MongoConnection;
  private connection: typeof mongoose | null = null;
  private uri: string | null = null;

  private constructor() {}

  /**
   * Get the singleton instance of MongoConnection.
   */
  public static getInstance(): MongoConnection {
    if (!MongoConnection.instance) {
      MongoConnection.instance = new MongoConnection();
    }
    return MongoConnection.instance;
  }

  /**
   * Connect to MongoDB using the provided URI and options.
   * Handles all mongoose connection states.
   */
  public async connect(uri: string, options: ConnectOptions = {}): Promise<typeof mongoose> {
    if (this.connection) return this.connection;
    if (!uri) throw new DatabaseEmptyUriError();
    
    try {
      let connection: typeof mongoose;
      const readyState = mongoose.connection.readyState;

      // Already connected
      if (readyState === 1) {
        connection = mongoose; 
      }

      // Connecting in progress: wait for completion
      else if (readyState === 2) {
        await new Promise((resolve) =>
          mongoose.connection.once("open", resolve)
        );
        connection = mongoose;
      }

      // Not connected: initiate connection
      else {
        connection = await mongoose.connect(uri, {
          ...options,
          bufferCommands: false,
        });
        await new Promise((resolve) =>
          mongoose.connection.once("open", resolve)
        );
        this.uri = uri;
      }

      this.connection = connection;
    } catch (err) {
      throw new DatabaseConnectionError(`Mongoose: ${String(err)}`);
    }

    return this.connection;
  }

  public getConnection(): typeof mongoose | null {
    return this.connection;
  }

  public getCollections(): mongoose.Collection<mongoose.mongo.BSON.Document>[] {
    if (!this.connection) throw new DatabaseNoConnectionError();
    return Object.values(this.connection.connection.collections);
  }

  public async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.disconnect();
      } catch (err) {
        throw new DatabaseDisconnectError(String(err));
      } finally {
        this.connection = null;
        this.uri = null;
      }
    }
  }
}

export async function dbConnect(uri: string = MONGODB_URI) {
  return await MongoConnection.getInstance().connect(uri);
}

export function getCollections() {
  try {
    let collections = null
    const connection = MongoConnection.getInstance().getConnection();
    if (connection) collections = MongoConnection.getInstance().getCollections();
    return collections;
  } catch (error) {
    throw new DatabaseCollectionError(String(error));
  }
}

export async function dbDisconnect() {
  return await MongoConnection.getInstance().disconnect();
}
