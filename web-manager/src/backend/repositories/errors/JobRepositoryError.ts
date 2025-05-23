import { ApiError } from "@/errors/ApiError";

class JobRepositoryError extends ApiError {
  constructor(message: string) {
    super(message);
    this.name = `${this.name}/JobRepository`;    
  }
}

export class CountUnratedJobsError extends JobRepositoryError {
  constructor(msg?: string) {    
    const message = `Fail while counting unrated jobs.`;
    super(message);
    if (msg) this.log(msg);
  }
}

export class CountLikedJobsError extends JobRepositoryError {
  constructor(msg?: string) {
    const message = `Fail while counting liked jobs.`;
    super(message);
    if (msg) this.log(msg);
  }
}

export class CountDislikedJobsError extends JobRepositoryError {
  constructor(msg?: string) {
    const message = `Fail while counting disliked jobs.`;
    super(message);
    if (msg) this.log(msg);
  }
}

export class GetAllJobsError extends JobRepositoryError {
  constructor(msg?: string) {
    const message = `Fail while retrieving all jobs.`;
    super(message);
    if (msg) this.log(msg);
  }
}

export class GetJobByIdError extends JobRepositoryError {
  constructor(msg?: string) {
    const message = `Fail while retrieving job by ID.`;
    super(message);
    if (msg) this.log(msg);
  }
}

export class CreateJobError extends JobRepositoryError {
  constructor(msg?: string) {
    const message = `Fail while creating job.`;
    super(message);
    if (msg) this.log(msg);
  }
}

export class UpdateJobError extends JobRepositoryError {
  constructor(msg?: string) {
    const message = `Fail while updating job.`;
    super(message);
    if (msg) this.log(msg);
  }
}

export class DeleteJobError extends JobRepositoryError {
  constructor(msg?: string) {
    const message = `Fail while deleting job.`;
    super(message);
    if (msg) this.log(msg);
  }
}