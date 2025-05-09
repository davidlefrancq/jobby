import type { NextApiRequest, NextApiResponse } from 'next';
import JobController from '@/backend/controllers/JobController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  if (!id) {
    return res.status(400).json({ error: 'Job ID is required' });
  }
  if (Array.isArray(id)) {
    return res.status(400).json({ error: 'Job ID must be a single value' });
  }
  if (id.length === 0) {
    return res.status(400).json({ error: 'Job ID cannot be empty' });
  }

  switch (method) {
    case 'GET':
      return JobController.get(req, res);
    case 'PUT':
      return JobController.update(req, res);
    case 'DELETE':
      return JobController.remove(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
