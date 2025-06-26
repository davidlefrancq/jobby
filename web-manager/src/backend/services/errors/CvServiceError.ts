import { ApiError } from "@/errors/ApiError";

class CvServiceError extends ApiError {
    constructor(message: string) {
    super(message);
    this.name = `${this.name}/CvService`;    
  }
}

export class CvServiceBadDbUriError extends CvServiceError {
  constructor(msg?: string) {
    const message = `Bad input: Database URI is invalid.`;
    super(message);
    this.log(msg);
  }
}

export class BadInputJobEmptyIdError extends CvServiceError {
  constructor(msg?: string) {
    const message = `Bad input: ID cannot be empty.`;
    super(message);
    this.log(msg);
  }
}

export class BadInputCvDataError extends CvServiceError {
  constructor(msg?: string) {
    const message = `Bad input: CV data is invalid.`;
    super(message);
    this.log(msg);
  }
}

export class GetCvByIdError extends CvServiceError {
  constructor(id: string) {
    const message = `Fail while retrieving CV by ID.`;
    super(message);
    this.log(`CV with ID ${id} not found or retrieval failed.`);
  }
}

export class CreateCvError extends CvServiceError {
  constructor(msg?: string) {
    const message = `Fail while creating CV.`;
    super(message);
    this.log(msg);
  }
}

export class UpdateCvError extends CvServiceError {
  constructor(id: string) {
    const message = `Fail while updating CV.`;
    super(message);
    this.log(`CV with ID ${id} not found or update failed`);
  }
}

export class DeleteCvError extends CvServiceError {
  constructor(id: string) {
    const message = `Fail while deleting CV.`;
    super(message);
    this.log(`CV with ID ${id} not found or deletion failed.`);
  }
}