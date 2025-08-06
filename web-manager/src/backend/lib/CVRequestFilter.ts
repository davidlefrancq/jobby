import sanitizeHtml from 'sanitize-html';
import { ICvEntity } from "@/types/ICvEntity";
import { FilterQuery } from "mongoose";
import { NextApiRequest } from "next";

export class CVRequestFilter {
  static getFilterFromNextRequest(req: NextApiRequest): FilterQuery<ICvEntity> {
    const filter: FilterQuery<ICvEntity> = {};
    const query = req.query || {};

    // Extracr title filter
    if (query.title) {
      if (typeof query.title === 'string') {
        const titleSanitized = sanitizeHtml(query.title);
        if (titleSanitized === 'null') filter.title = null;
        else filter.title = titleSanitized;
      }
    }

    return filter;
  }
}