import type { NextApiRequest, NextApiResponse } from 'next';
import JobController from '@/backend/controllers/JobController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return JobController.list(req, res);
    case 'POST':
      return JobController.create(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
