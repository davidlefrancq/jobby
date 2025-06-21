import mongoose, { ConnectOptions } from "mongoose";
import {
  DatabaseConnectionError,
  DatabaseDisconnectError,
  DatabaseEmptyUriError,
  DatabaseNoConnectionError
} from "./errors/DatabaseError";

interface MongoConnectionOptions {
  uri?: string;
}

/**
 * Singleton class managing Mongoose connection.
 */
export class MongoConnection {
  private static instance: MongoConnection;
  private connection: typeof mongoose | null = null;
  private uri: string | undefined;

  private constructor({ uri }: MongoConnectionOptions) {
    if (uri) this.uri = uri;
  }

  /**
   * Get the singleton instance of MongoConnection.
   */
  public static getInstance({ uri }: MongoConnectionOptions): MongoConnection {
    if (!MongoConnection.instance) {
      if (!uri) throw new DatabaseEmptyUriError("Database URI is required to create MongoConnection instance.");
      MongoConnection.instance = new MongoConnection({ uri });
    }
    return MongoConnection.instance;
  }

  /**
   * Connect to MongoDB using the provided URI and options.
   * Handles all mongoose connection states.
   */
  public async connect(options: ConnectOptions = {}): Promise<typeof mongoose> {
    // Validate URI
    if (!this.uri) throw new DatabaseEmptyUriError();

    // If already connected, return the existing connection
    if (this.connection) return this.connection;
    
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
        mongoose.set('sanitizeFilter', true);
        connection = mongoose;
      }

      // Not connected: initiate connection
      else {
        connection = await mongoose.connect(this.uri, {
          ...options,
          bufferCommands: false,
        });
        await new Promise((resolve) =>
          mongoose.connection.once("open", resolve)
        );
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
        this.uri = '';
      }
    }
  }
}
