import { NextApiRequest, NextApiResponse } from 'next';
import { CvService } from '@/backend/services/CvService';
import { ICvsSelectRequest } from '@/interfaces/ICvsSelectRequest';
import { ICvEntity } from '@/types/ICvEntity';
import { CVRequestFilter } from '../lib/CVRequestFilter';

// Database URI from environment variables
const dbUri = process.env.MONGODB_URI || '';

/**
 * Controller for handling HTTP requests related to CVs.
 * Delegates business logic to the CVService.
 */
export default class CVController {

  /**
   * Handles GET /api/cvs/count
   * Returns the count of all cvs.
   */
  public static async count(req: NextApiRequest, res: NextApiResponse) {
    // Check if the request is a GET request
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    
    try {
      // Extract filter parameters from request
      const filter = CVRequestFilter.getFilterFromNextRequest(req);
      const count = await CvService.getInstance({ dbUri }).countCvs(filter);
      return res.status(200).json({ count });
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  /**
   * Handles GET /api/cvs
   * Lists all cvs, optionally filtered via query parameters.
   */
  public static async list(req: NextApiRequest, res: NextApiResponse) {
    // Check if the request is a GET request
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
      // Extract query parameters for pagination
      const cvsRequest: ICvsSelectRequest = {}
      const query = req.query || {};
      if (query.limit) cvsRequest.limit = parseInt(query.limit as string, 10);
      if (query.skip) cvsRequest.skip = parseInt(query.skip as string, 10);
      
      // Extract filter parameters from request
      cvsRequest.filter = CVRequestFilter.getFilterFromNextRequest(req);

      // Execute the service method to list cvs
      const cvs = await CvService.getInstance({ dbUri }).listCvs(cvsRequest);
      return res.status(200).json(cvs);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  /**
   * Handles GET /api/cvs/:id
   * Retrieves a single cv by its ID.
   */
  public static async get(req: NextApiRequest, res: NextApiResponse) {
    // Check if the request is a GET request
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
      const { id } = req.query;
      const cv = await CvService.getInstance({ dbUri }).getCvById(id as string);
      return res.status(200).json(cv);
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  }

  /**
   * Handles POST /api/cvs
   * Creates a new cv document.
   */
  public static async create(req: NextApiRequest, res: NextApiResponse) {
    // Check if the request is a POST request
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
      const data = req.body;
      const created = await CvService.getInstance({ dbUri }).createCv(data);
      return res.status(201).json(created);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  /**
   * Handles PUT /api/cvs/:id
   * Updates an existing cv document.
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
        return res.status(400).json({ error: 'CV ID is required' });
      }
      if (typeof id !== 'string') {
        return res.status(400).json({ error: 'CV ID must be a string' });
      }

      console.log('id', id);
      const data: Partial<ICvEntity> = req.body;
      console.log('data', data);
      const updated = await CvService.getInstance({ dbUri }).updateCv(id, data);
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  }

  /**
   * Handles DELETE /api/cvs/:id
   * Deletes a cv document.
   */
  public static async remove(req: NextApiRequest, res: NextApiResponse) {
    // Check if the request is a DELETE request
    if (req.method !== 'DELETE') {
      res.setHeader('Allow', ['DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
      const { id } = req.query;
      await CvService.getInstance({ dbUri }).deleteCv(id as string);
      return res.status(204).end();
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  }
}
