import mongoose from "mongoose";
import { JobRepository } from "./JobRepository";

export class RepositoryFactory {
  private static instance: RepositoryFactory | null = null;
  private connection: typeof mongoose | null = null;
  private jobRepository: JobRepository | null = null;

  // Private constructor to prevent direct instantiation
  private constructor() {}
  /**
   * Retrieves the singleton instance.
   */
  public static getInstance(): RepositoryFactory {
    if (RepositoryFactory.instance === null) {
      RepositoryFactory.instance = new RepositoryFactory();
    }
    return RepositoryFactory.instance;
  }
  /**
   * Retrieves the job repository.
   */
  public getJobRepository(): JobRepository {
    if (this.jobRepository === null) {
      this.jobRepository = JobRepository.getInstance();
    }
    return this.jobRepository;
  }

  /** Destructor */
  public destroy(): void {
    if (this.jobRepository) this.jobRepository = null;
    if (this.connection) {
      this.connection.disconnect().then(() => {
        console.log("Disconnect from MongoDB");
      }).catch((error) => {
        console.error("MongoDB safe disconnection has failed.")
        console.error(error);
      }).finally(() => {
        this.connection = null;
        RepositoryFactory.instance = null;
      });
    }
    else RepositoryFactory.instance = null;
  }
}