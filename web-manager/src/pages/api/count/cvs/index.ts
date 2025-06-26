import type { NextApiRequest, NextApiResponse } from 'next';
import CVController from '@/backend/controllers/CVController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return CVController.count(req, res);
    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
