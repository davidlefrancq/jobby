import { ApiError } from "@/errors/ApiError";

class CvRepositoryError extends ApiError {
    constructor(message: string) {
    super(message);
    this.name = `${this.name}/CvRepository`;    
  }
}

export class GetAllCvsError extends CvRepositoryError {
  constructor(msg?: string) {
    const message = `Fail while retrieving all CVs.`;
    super(message);
    this.log(msg);  }
}

export class GetCvByIdError extends CvRepositoryError {
  constructor(msg?: string) {
    const message = `Fail while retrieving CV by ID.`;
    super(message);
    this.log(msg);  }
}

export class CreateCvError extends CvRepositoryError {
  constructor(msg?: string) {
    const message = `Fail while creating CV.`;
    super(message);
    this.log(msg);  }
}

export class UpdateCvError extends CvRepositoryError {
  constructor(msg?: string) {
    const message = `Fail while updating CV.`;
    super(message);
    this.log(msg);  }
}

export class DeleteCvError extends CvRepositoryError {
  constructor(msg?: string) {
    const message = `Fail while deleting CV.`;
    super(message);
    this.log(msg);  }
}