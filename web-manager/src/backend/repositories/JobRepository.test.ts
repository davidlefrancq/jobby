import { MongoMemoryServer } from 'mongodb-memory-server';
import { JobRepository } from '@/backend/repositories/JobRepository';
import { IJob } from '@/backend/models/IJob';
import mongoose from 'mongoose';
import { ApiLogger } from '@/errors/ApiLogger';
import { ApiError } from '@/errors/ApiError';

let mongoServer: MongoMemoryServer;
let jobRepository: JobRepository;
let dbUri: string;

// Mock ApiLogger to prevent actual logging during tests
jest.spyOn(ApiLogger.prototype, 'info').mockImplementation(async () => {});
jest.spyOn(ApiLogger.prototype, 'warn').mockImplementation(async () => {});
jest.spyOn(ApiLogger.prototype, 'error').mockImplementation(async () => {});
jest.spyOn(ApiError.prototype, 'log').mockImplementation(async () => {});

// Set up an in-memory MongoDB server before running tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  dbUri = mongoServer.getUri();
  jobRepository = JobRepository.getInstance({ dbUri })
});

// Clear all data from collections after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  if (collections) {
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

// Stop MongoDB server and disconnect after all tests
afterAll(async () => {
  // Ensure cvService is properly destroyed
  await jobRepository.destroy();
  await mongoose.connection.close(true);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for Mongoose to close connections

  // Stop the MongoDB server if it exists
  if (mongoServer) {
    try {
      if (typeof mongoServer.stop === "function") {
        await mongoServer.stop({ force: true, doCleanup: true });
      }
    } catch (e) {
      console.error("🔴 Error stopping MongoDB server:", e);
    }
  }
});

// Singleton test
describe('JobRepository Singleton', () => {
  it('getInstance() should always return the same instance', () => {
    const first = JobRepository.getInstance({ dbUri });
    const second = JobRepository.getInstance({ dbUri });
    expect(first).toBe(second);
  });

  it('default export must be that instance', () => {
    expect(jobRepository).toBe(JobRepository.getInstance({ dbUri }));
  });
});

// Repository methods tests
describe('JobRepository CRUD operations', () => {
  // Sample job document used for testing
  const sample: Partial<IJob> = {
    company: 'Acme Corp',
    contract_type: 'Full-time',
    date: '2025-05-01',
    description: 'Test job',
    interest_indicator: 'High',
    level: 'Senior',
    location: 'Paris',
    methodologies: ['Agile'],
    salary: { currency: 'EUR', min: 3000, max: 5000 },
    source: 'LinkedIn',
    technologies: null,
    teleworking: true,
    title: 'DevOps Engineer',
  };

  it('should create a new job document', async () => {
    const created = await jobRepository.create(sample);
    expect(created._id).toBeDefined();
    expect(created.company).toBe(sample.company);
  });

  it('should retrieve all job documents', async () => {
    await jobRepository.create(sample);
    const all = await jobRepository.getAll({ limit: 9, skip: 0 });
    expect(all).toHaveLength(1);
    expect(all[0].title).toBe(sample.title);
  });

  it('should retrieve a job document by ID', async () => {
    const created = await jobRepository.create(sample);
    const found = await jobRepository.getById(created._id.toString());
    expect(found).not.toBeNull();
    expect(found!.source).toBe(sample.source);
  });

  it('should count unrated jobs', async () => {
    await jobRepository.create(sample);
    const count = await jobRepository.countUnratedJobs();
    expect(count).toBe(1);
  });

  it('should update an existing job document', async () => {
    const created = await jobRepository.create(sample);
    const updated = await jobRepository.update(created._id.toString(), { level: 'Lead' });
    expect(updated).not.toBeNull();
    expect(updated!.level).toBe('Lead');
  });

  it('should delete a job document', async () => {
    const created = await jobRepository.create(sample);
    await jobRepository.delete(created._id.toString());
    const allAfterDelete = await jobRepository.getAll({ limit: 9, skip: 0 });
    expect(allAfterDelete).toHaveLength(0);
  });
});