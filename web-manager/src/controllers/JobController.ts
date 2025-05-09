import { NextApiRequest, NextApiResponse } from 'next';
import jobService from '@/services/JobService';

/**
 * Controller for handling HTTP requests related to Jobs.
 * Delegates business logic to the JobService.
 */
export default class JobController {
  /**
   * Handles GET /api/jobs
   * Lists all jobs, optionally filtered via query parameters.
   */
  public static async list(req: NextApiRequest, res: NextApiResponse) {
    try {
      const filter = req.query || {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const jobs = await jobService.listJobs(filter as any);
      return res.status(200).json(jobs);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  /**
   * Handles GET /api/jobs/:id
   * Retrieves a single job by its ID.
   */
  public static async get(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { id } = req.query;
      const job = await jobService.getJobById(id as string);
      return res.status(200).json(job);
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  }

  /**
   * Handles POST /api/jobs
   * Creates a new job document.
   */
  public static async create(req: NextApiRequest, res: NextApiResponse) {
    try {
      const data = req.body;
      const created = await jobService.createJob(data);
      return res.status(201).json(created);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  /**
   * Handles PUT /api/jobs/:id
   * Updates an existing job document.
   */
  public static async update(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { id } = req.query;
      const data = req.body;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updated = await jobService.updateJob(id as string, data as any);
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  }

  /**
   * Handles DELETE /api/jobs/:id
   * Deletes a job document.
   */
  public static async remove(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { id } = req.query;
      await jobService.deleteJob(id as string);
      return res.status(204).end();
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  }
}
