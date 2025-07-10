import { ICvEntity } from "@/types/ICvEntity";

export class CvRepository {
  // Holds the singleton instance
  private static instance: CvRepository | null = null;

  // Private constructor to prevent direct instantiation
  private constructor() {}

  /**
   * Retrieves the singleton instance.
   */
  public static getInstance(): CvRepository {
    if (CvRepository.instance === null) CvRepository.instance = new CvRepository();
    return CvRepository.instance;
  }

  private getHeaders(): Headers {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    return headers;
  }

  public async count(): Promise<number> {
    let count: number = 0;
    try {
      const headers = this.getHeaders();
      const url = `/api/count/cvs`;
      const res = await fetch(url, { method: 'GET', headers });
      if (res.ok) {
        const jsonData = (await res.json()) as { count: number };
        if (jsonData && jsonData.count) {
          count = jsonData.count;
        }
      } else {
        throw new Error(`${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      throw new Error(String(err));
    }
    return count;
  }

  public async getAll(limit: number, skip: number): Promise<ICvEntity[]> {
    let cvs: ICvEntity[] = [];
    try {
      const headers = this.getHeaders();
      const url = `/api/cvs?limit=${limit}&skip=${skip}`;
      const res = await fetch(url, { method: 'GET', headers });
      if (res.ok) {
        cvs = (await res.json()) as ICvEntity[];
      } else {
        throw new Error(`${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      throw new Error(String(err));
    }
    return cvs;
  }

  public async getById(id: string): Promise<ICvEntity | null> {
    let cv: ICvEntity | null = null;
    try {
      const headers = this.getHeaders();
      const url = `/api/cvs/${id}`;
      const res = await fetch(url, { method: 'GET', headers });
      if (res.ok) {
        cv = (await res.json()) as ICvEntity;
      } else if (res.status === 404) {
        cv = null; // Not found
      } else {
        throw new Error(`${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      throw new Error(String(err));
    }
    return cv;
  }

  public async create(data: Partial<ICvEntity>): Promise<ICvEntity> {
    let createdCv: ICvEntity;
    try {
      const headers = this.getHeaders();
      const url = `/api/cvs`;
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      if (res.ok) {
        createdCv = (await res.json()) as ICvEntity;
      } else {
        throw new Error(`${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      throw new Error(String(err));
    }
    return createdCv;
  }

  public async update(id: string, data: Partial<ICvEntity>): Promise<ICvEntity> {
    let updatedCv: ICvEntity;
    try {
      const headers = this.getHeaders();
      const url = `/api/cvs/${id}`;
      const res = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
      if (res.ok) {
        updatedCv = (await res.json()) as ICvEntity;
      } else {
        throw new Error(`${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      throw new Error(String(err));
    }
    return updatedCv;
  }

  public async remove(id: string): Promise<boolean> {
    let isRemoved: boolean = false;
    try {
      const headers = this.getHeaders();
      const url = `/api/cvs/${id}`;
      const res = await fetch(url, { method: 'DELETE', headers });
      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      } else isRemoved = true;
    } catch (err) {
      throw new Error(String(err));
    }
    return isRemoved;
  }
}