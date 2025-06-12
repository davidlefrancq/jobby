import { ApiError } from "@/errors/ApiError";

class JobServiceError extends ApiError {
    constructor(message: string) {
    super(message);
    this.name = `${this.name}/CvService`;    
  }
}

export class GetJobByIdError extends JobServiceError {
  constructor(id: string) {
    const message = `Fail while retrieving job by ID.`;
    super(message);
    this.log(`Job with ID ${id} not found or retrieval failed.`);
  }
}

export class CreateJobError extends JobServiceError {
  constructor(msg?: string) {
    const message = `Fail while creating job.`;
    super(message);
    this.log(msg);
  }
}

export class UpdateJobError extends JobServiceError {
  constructor(id: string) {
    const message = `Fail while updating job.`;
    super(message);
    this.log(`Job with ID ${id} not found or update failed`);
  }
}

export class DeleteJobError extends JobServiceError {
  constructor(id: string) {
    const message = `Fail while deleting job.`;
    super(message);
    this.log(`Job with ID ${id} not found or deletion failed.`);
  }
}
