import CVController from '@/backend/controllers/CVController';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  if (!id) {
    return res.status(400).json({ error: 'CV ID is required' });
  }
  if (Array.isArray(id)) {
    return res.status(400).json({ error: 'CV ID must be a single value' });
  }
  if (id.length === 0) {
    return res.status(400).json({ error: 'CV ID cannot be empty' });
  }

  switch (method) {
    case 'GET':
      return CVController.get(req, res);
    case 'PUT':
      return CVController.update(req, res);
    case 'DELETE':
      return CVController.remove(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
