import sanitizeHtml from 'sanitize-html';
import { IJobEntity } from "@/types/IJobEntity";
import { FilterQuery } from "mongoose";
import { NextApiRequest } from "next";

export class JobRequestFilter {
  static getFilterFromNextRequest(req: NextApiRequest): FilterQuery<IJobEntity> {
    const filter: FilterQuery<IJobEntity> = {};
    const query = req.query || {};

    // Extracr preference filter
    if (query.preference) {
      if (typeof query.preference === 'string') {
        const preferenceSanitized = sanitizeHtml(query.preference);
        const preference = preferenceSanitized.toLowerCase();
        if (preference === 'null') filter.preference = null;
        else filter.preference = preference;
      }
    }

    return filter;
  }
}