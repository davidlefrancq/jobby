import mongoose, { ConnectOptions } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

export class MongoConnection {
  private static instance: MongoConnection;
  private connection: typeof mongoose | null = null;
  private uri: string | null = null;

  private constructor() {}

  public static getInstance(): MongoConnection {
    if (!MongoConnection.instance) {
      MongoConnection.instance = new MongoConnection();
    }
    return MongoConnection.instance;
  }

  public async connect(uri: string, options: ConnectOptions = {}): Promise<typeof mongoose> {
    if (this.connection) return this.connection;

    if (!uri) {
      throw new Error("🔴 MONGODB_URI must be defined.");
    }

    if (this.connection) {
      if (this.uri !== uri) {
        throw new Error("🔴 Can't connect: different URI used on existing Mongoose connection.");
      }
      return this.connection;
    }

    this.uri = uri;

    try {
      this.connection = await mongoose.connect(uri, {
        ...options,
        bufferCommands: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`🔴 Mongoose connection failed: ${message}`);
    }

    return this.connection;
  }

  public getConnection(): typeof mongoose | null {
    return this.connection;
  }

  public getCollections(): mongoose.Collection<mongoose.mongo.BSON.Document>[] {
    if (!this.connection) {
      throw new Error("🔴 No connection to MongoDB.");
    }
    return Object.values(this.connection.connection.collections);
  }

  public async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.disconnect();
      this.connection = null;
      this.uri = null;
    }
  }
}

export async function dbConnect(uri: string = MONGODB_URI) {
  return await MongoConnection.getInstance().connect(uri);
}

export function getCollections() {
  let collections = null
  const connection = MongoConnection.getInstance().getConnection();
  if (connection) collections = MongoConnection.getInstance().getCollections();
  return collections;
}

export async function dbDisconnect() {
  return await MongoConnection.getInstance().disconnect();
}
