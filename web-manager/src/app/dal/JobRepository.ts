import { JobsSelectRequestProps } from "../interfaces/JobsSelectRequestProps";
import { IJobEntity } from "@/types/IJobEntity";

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

  /**
   * Retrieves all jobs matching the optional filter.
   * @param filter - Mongoose filter query
   */
  public async getAll({ limit, skip }: JobsSelectRequestProps): Promise<IJobEntity[]> {
    let data: IJobEntity[] = [];
    try {
      const headers = this.getHeaders();
      const url = `/api/jobs?limit=${limit}&skip=${skip}`;
      const res = await fetch(url, { method: 'GET', headers });
      if (res.ok) data = (await res.json()) as IJobEntity[];
      else console.error(`Error ${res.status}: ${res.statusText}`)
    } catch (err) {
      console.error(err);
      throw new Error("Failed getting jobs.");
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
      else console.error(`Error ${res.status}: ${res.statusText}`)
    } catch (err) {
      console.error(err);
      throw new Error("Failed getting job.");
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
      else console.error(`Error ${res.status}: ${res.statusText}`)
    } catch (err) {
      console.error(err);
      throw new Error("Failed creating job.");
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
      else console.error(`Error ${res.status}: ${res.statusText}`)
    } catch (err) {
      console.error(err);
      throw new Error("Failed updating job.");
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
      if (!res.ok) console.error(`Error ${res.status}: ${res.statusText}`)
    } catch (err) {
      console.error(err);
      throw new Error("Failed deleting job.");
    }
  }
  
}