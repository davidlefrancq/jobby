import { IJobEntity } from "@/types/IJobEntity";

export class JobSorter {
  static byDate(a: IJobEntity, b: IJobEntity): number {
    let result = 0;
    if (!a.date && b.date) {
      result = -1;
    } else if (a.date && !b.date) {
      result = 1;
    } else if (a.date && b.date) {
      const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateDiff > 0) result = 1;
      else if (dateDiff < 0) result = -1;
    }
    return result;
  }

  static byCreatedAt(a: IJobEntity, b: IJobEntity): number {
    let result = 0;
    if (!a.createdAt && b.createdAt) {
      result = -1;
    } else if (a.createdAt && !b.createdAt) {
      result = 1;
    } else if (a.createdAt && b.createdAt) {
      const dateDiff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (dateDiff > 0) result = 1;
      else if (dateDiff < 0) result = -1;
    }
    return result;
  }

  static byUpdatedAt(a: IJobEntity, b: IJobEntity): number {
    let result = 0;
    if (!a.updatedAt && b.updatedAt) {
      result = -1;
    } else if (a.updatedAt && !b.updatedAt) {
      result = 1;
    } else if (a.updatedAt && b.updatedAt) {
      const dateDiff = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (dateDiff > 0) result = 1;
      else if (dateDiff < 0) result = -1;
    }
    return result;
  }
}