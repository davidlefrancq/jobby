import { MongoMemoryServer } from 'mongodb-memory-server';
import jobRepoDefault from '@/backend/repositories/JobRepository';
import { JobRepository } from '@/backend/repositories/JobRepository';
import { IJob } from '@/backend/models/IJob';
import { dbDisconnect, getCollections, MongoConnection } from '../lib/dbConnect';

let mongoServer: MongoMemoryServer;
let db: MongoConnection;

// Set up an in-memory MongoDB server before running tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  db = MongoConnection.getInstance();
  await db.connect(mongoServer.getUri()!);
});

// Clear all data from collections after each test
afterEach(async () => {
  const collections = await getCollections()
  if (collections) {
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

// Stop MongoDB server and disconnect Mongoose after all tests
afterAll(async () => {
  await dbDisconnect()
  await mongoServer.stop();
});

// Singleton test
describe('JobRepository Singleton', () => {
  it('getInstance() should always return the same instance', () => {
    const first = JobRepository.getInstance();
    const second = JobRepository.getInstance();
    expect(first).toBe(second);
  });

  it('default export must be that instance', () => {
    expect(jobRepoDefault).toBe(JobRepository.getInstance());
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
    const created = await jobRepoDefault.create(sample);
    expect(created._id).toBeDefined();
    expect(created.company).toBe(sample.company);
  });

  it('should retrieve all job documents', async () => {
    await jobRepoDefault.create(sample);
    const all = await jobRepoDefault.getAll({ limit: 9, skip: 0 });
    expect(all).toHaveLength(1);
    expect(all[0].title).toBe(sample.title);
  });

  it('should retrieve a job document by ID', async () => {
    const created = await jobRepoDefault.create(sample);
    const found = await jobRepoDefault.getById(created._id.toString());
    expect(found).not.toBeNull();
    expect(found!.source).toBe(sample.source);
  });

  it('should count unrated jobs', async () => {
    await jobRepoDefault.create(sample);
    const count = await jobRepoDefault.countUnratedJobs();
    expect(count).toBe(1);
  });

  it('should update an existing job document', async () => {
    const created = await jobRepoDefault.create(sample);
    const updated = await jobRepoDefault.update(created._id.toString(), { level: 'Lead' });
    expect(updated).not.toBeNull();
    expect(updated!.level).toBe('Lead');
  });

  it('should delete a job document', async () => {
    const created = await jobRepoDefault.create(sample);
    await jobRepoDefault.delete(created._id.toString());
    const allAfterDelete = await jobRepoDefault.getAll({ limit: 9, skip: 0 });
    expect(allAfterDelete).toHaveLength(0);
  });
});