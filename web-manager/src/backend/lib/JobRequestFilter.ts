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

    // Extract processing_stage filter
    if (query.processing_stage) {
      if (typeof query.processing_stage === 'string') {
        const processingStageSanitized = sanitizeHtml(query.processing_stage);
        const processingStage = processingStageSanitized.toLowerCase();
        if (processingStage === 'null') filter.processing_stage = null;
        else filter.processing_stage = processingStage;
      }
    }

    // Extract outdated filter
    if (query.outdated) {
      if (query.outdated.toLocaleString().toLowerCase() === 'true') {
        filter.outdated = true;
      } else if (query.outdated.toLocaleString().toLowerCase() === 'false') {
        filter.outdated = false;
      }
    }

    // Extrac source filter
    if (query.source) {
      if (typeof query.source === 'string') {
        const sourceSanitized = sanitizeHtml(query.source);
        const source = sourceSanitized;
        if (source === 'null') filter.source = null;
        else filter.source = source;
      }
    }

    return filter;
  }
}