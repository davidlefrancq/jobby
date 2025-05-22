import { ApiError } from "@/errors/ApiError"

class DatabaseError extends ApiError {
  date: string

  constructor(message: string) {
    super(message)
    this.name = `${this.name}/DatabaseError`
    this.date = new Date().toDateString()
  }

  log(msg?: string) {
    let logMessage = `[${this.date}] ${this.name}: ${this.message}`
    if (msg) logMessage += ` ${msg}`
    console.error(`🔴 ${logMessage}`)
  }
}

export class DatabaseConnectionError extends DatabaseError {
  constructor(msg?: string) {
    const message = `Database connection failed.`
    super(message)
    if (msg) this.log(msg)
  }
}

export class DatabaseNoConnectionError extends DatabaseError {
  constructor(msg?: string) {
    const message = `No connection to the database.`
    super(message)
    if (msg) this.log(msg)
  }
}

export class DatabaseDisconnectError extends DatabaseError {
  constructor(msg?: string) {
    const message = `Database disconnection failed.`
    super(message)
    if (msg) this.log(msg)
  }
}

export class DatabaseEmptyUriError extends DatabaseError {
  constructor(msg?: string) {
    const message = `Database URI is not defined.`
    super(message)
    if (msg) this.log(msg)
  }
}

export class DatabaseBadUriError extends DatabaseError {
  constructor(msg?: string) {
    const message = `Database URI is not valid.`
    super(message)
    if (msg) this.log(msg)
  }
}

export class DatabaseCollectionError extends DatabaseError {
  constructor(msg?: string) {
    const message = `Database collection not found.`
    super(message)
    if (msg) this.log(msg)
  }
}