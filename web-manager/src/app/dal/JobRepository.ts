import { IJobsSelectRequest } from "../../interfaces/IJobsSelectRequest";
import { IJobEntity } from "@/types/IJobEntity";
import { CountUnratedJobsError, CreateJobError, DeleteJobError, GetAllJobsError, GetJobByIdError, UpdateJobError } from "./errors/JobRepositoryError";

export class JobRepository {
  // Holds the singleton instance
  private static instance: JobRepository | null = null;

  // Private constructor to prevent direct instantiation
  private constructor() {}
  
  /**
   * Retrieves the singleton instance.
   */
  public static getInstance(): JobRepository {
    if (JobRepository.instance === null) JobRepository.instance = new JobRepository();
    return JobRepository.instance;
  }

  private getHeaders(): Headers {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    return headers;
  }

  public async getJobsUnratedCounter(): Promise<number> {
    let count: number = 0;
    try {
      const headers = this.getHeaders();
      const url = `/api/count/jobs/unrated`;
      const res = await fetch(url, { method: 'GET', headers });
      if (res.ok) {
        const jsonData = (await res.json()) as { count: number };
        if (jsonData && jsonData.count) {
          count = jsonData.count;
        }
      } else {
        throw new CountUnratedJobsError(`${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      throw new CountUnratedJobsError(String(err));
    }
    return count;
  }

  public async getJobsLikedCounter(): Promise<number> {
    let count: number = 0;
    try {
      const headers = this.getHeaders();
      const url = `/api/count/jobs/liked`;
      const res = await fetch(url, { method: 'GET', headers });
      if (res.ok) {
        const jsonData = (await res.json()) as { count: number };
        if (jsonData && jsonData.count) {
          count = jsonData.count;
        }
      } else {
        throw new CountUnratedJobsError(`${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      throw new CountUnratedJobsError(String(err));
    }
    return count;
  }

  public async getJobsDislikedCounter(): Promise<number> {
    let count: number = 0;
    try {
      const headers = this.getHeaders();
      const url = `/api/count/jobs/disliked`;
      const res = await fetch(url, { method: 'GET', headers });
      if (res.ok) {
        const jsonData = (await res.json()) as { count: number };
        if (jsonData && jsonData.count) {
          count = jsonData.count;
        }
      } else {
        throw new CountUnratedJobsError(`${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      throw new CountUnratedJobsError(String(err));
    }
    return count;
  }

  /**
   * Retrieves all jobs matching the optional filter.
   * @param filter - Mongoose filter query
   */
  public async getAll({ filter, limit, skip }: IJobsSelectRequest): Promise<IJobEntity[]> {
    let data: IJobEntity[] = [];
    try {
      const headers = this.getHeaders();
      let url = `/api/jobs?limit=${limit}&skip=${skip}`;

      if (filter) {
        if (filter.preference) url += `&preference=${filter.preference}`;
        if (filter.processing_stage) url += `&processing_stage=${filter.processing_stage}`;
        if (filter.outdated === true || filter.outdated === false) url += `&outdated=${filter.outdated === true ? 'true' : 'false'}`;
        if (filter.source) url += `&source=${filter.source}`;
      }

      const res = await fetch(url, { method: 'GET', headers });
      if (res.ok) data = (await res.json()) as IJobEntity[];
      else {
        throw new GetAllJobsError(`${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      throw new GetAllJobsError(String(err));
    }
    return data;
  }

  /**
   * Retrieves a job by its ID.
   * @param id - Job document ID
   */
  public async getById(id: string): Promise<IJobEntity | null> {
    let data: IJobEntity | null = null;
    try {
      const headers = this.getHeaders();
      const url = `/api/jobs/${id}`;
      const res = await fetch(url, { method: 'GET', headers });
      if (res.ok) data = (await res.json()) as IJobEntity;
      else {
        throw new GetJobByIdError(`${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      throw new GetJobByIdError(String(err));
    }
    return data;
  }

  public async getBySource({source}: {source: string}): Promise<IJobEntity | null> {
    if (!source) throw new Error("Source is required");

    let data: IJobEntity | null = null;
    try {
      const response = await this.getAll({ filter: { source }, limit: 1, skip: 0 });
      if (response && response.length > 0) data = response[0];
    } catch (err) {
      throw new GetJobByIdError(String(err));
    }
    return data;
  }

  /**
   * Creates a new job document.
   * @param data - Partial job data
   */
  public async create(data: Partial<IJobEntity>): Promise<IJobEntity | null> {
    let created: IJobEntity | null = null;
    try {
      const headers = this.getHeaders();
      const url = `/api/jobs`;
      const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(data) });
      if (res.ok) created = (await res.json()) as IJobEntity;
      else {
        throw new CreateJobError(`${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      throw new CreateJobError(String(err));
    }
    return created;
  }

  /**
   * Updates an existing job by ID.
   * @param id - Job document ID
   * @param data - Fields to update
   */
  public async update(id: string, data: Partial<IJobEntity>): Promise<IJobEntity | null> {
    let updated: IJobEntity | null = null;
    try {
      const headers = this.getHeaders();
      const url = `/api/jobs/${id}`;
      const res = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(data) });
      if (res.ok) updated = (await res.json()) as IJobEntity;
      else {
        throw new UpdateJobError(`${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      throw new UpdateJobError(String(err));
    }
    return updated;
  }

  /**
   * Deletes a job by its ID.
   * @param id - Job document ID
   */
  public async delete(id: string): Promise<void> {
    try {
      const headers = this.getHeaders();
      const url = `/api/jobs/${id}`;
      const res = await fetch(url, { method: 'DELETE', headers });
      if (!res.ok) {
        throw new DeleteJobError(`${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      throw new DeleteJobError(String(err));
    }
  }
  
}