import { NextApiRequest, NextApiResponse } from 'next';
import jobService from '@/backend/services/JobService';
import { JobsSelectRequestProps } from '@/app/interfaces/JobsSelectRequestProps';
import { IJobEntity } from '@/types/IJobEntity';

/**
 * Controller for handling HTTP requests related to Jobs.
 * Delegates business logic to the JobService.
 */
export default class JobController {

  /**
   * Handles GET /api/jobs/countUnpreferenced
   * Returns the count of unpreferenced jobs.
   */
  public static async countUnpreferenced(req: NextApiRequest, res: NextApiResponse) {
    // Check if the request is a GET request
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
      const count = await jobService.countUnpreferencedJobs();
      return res.status(200).json({ count });
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  /**
   * Handles GET /api/jobs
   * Lists all jobs, optionally filtered via query parameters.
   */
  public static async list(req: NextApiRequest, res: NextApiResponse) {
    // Check if the request is a GET request
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
      // Extract query parameters for pagination
      const jobsRequest: JobsSelectRequestProps = {}
      const query = req.query || {};
      if (query.limit) jobsRequest.limit = parseInt(query.limit as string, 10);
      if (query.skip) jobsRequest.skip = parseInt(query.skip as string, 10);
      
      // Execute the service method to list jobs
      const jobs = await jobService.listJobs(jobsRequest);
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
    // Check if the request is a GET request
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

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
    // Check if the request is a POST request
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

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
    console.log('update');

    // Check if the request is a PUT request
    if (req.method !== 'PUT') {
      res.setHeader('Allow', ['PUT']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'Job ID is required' });
      }
      if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Job ID must be a string' });
      }

      console.log('id', id);
      const data: Partial<IJobEntity> = req.body;
      console.log('data', data);
      const updated = await jobService.updateJob(id, data);
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
    // Check if the request is a DELETE request
    if (req.method !== 'DELETE') {
      res.setHeader('Allow', ['DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
      const { id } = req.query;
      await jobService.deleteJob(id as string);
      return res.status(204).end();
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  }
}
