import { MongoMemoryServer } from 'mongodb-memory-server';
import jobService from '@/backend/services/JobService';
import { IJob } from '@/backend/models/IJob';
import { getCollections, MongoConnection } from '../lib/dbConnect';

let mongoServer: MongoMemoryServer;
let db: MongoConnection;

// Start in-memory MongoDB server before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  db = MongoConnection.getInstance();
  await db.connect(mongoServer.getUri()!);
});

// Clear database after each test
afterEach(async () => {
  const collections = await getCollections()
  if (collections) {
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

// Stop server and disconnect after all tests
afterAll(async () => {
  await db.disconnect()
  await mongoServer.stop();
});

describe('JobService Integration Tests', () => {
  // Sample job data for testing
  const sampleData: Partial<IJob> = {
    company: 'TestCorp',
    contract_type: 'Part-time',
    date: '2025-06-01',
    description: 'Integration test job',
    interest_indicator: 'Medium',
    level: 'Junior',
    location: 'Remote',
    methodologies: ['Kanban'],
    salary: { currency: 'USD', min: 2000, max: 3000 },
    source: 'TestSource',
    technologies: null,
    teleworking: false,
    title: 'Test Engineer',
  };

  it('should create and return a new job', async () => {
    const created = await jobService.createJob(sampleData);
    expect(created._id).toBeDefined();
    expect(created.title).toBe(sampleData.title);
  });

  it('should list all jobs', async () => {
    await jobService.createJob(sampleData);
    const list = await jobService.listJobs({ limit:9, skip:0 });
    expect(Array.isArray(list)).toBe(true);
    expect(list).toHaveLength(1);
  });

  it('should retrieve a job by id', async () => {
    const created = await jobService.createJob(sampleData);
    const fetched = await jobService.getJobById(created._id.toString());
    expect(fetched).not.toBeNull();
    expect(fetched.company).toBe(sampleData.company);
  });

  it('should throw error when retrieving non-existing job', async () => {
    await expect(jobService.getJobById('608d1f2b8e620f1a7c8b4567')).rejects.toThrow(
      /not found/
    );
  });

  it('should update an existing job', async () => {
    const created = await jobService.createJob(sampleData);
    const updated = await jobService.updateJob(created._id.toString(), {
      level: 'Mid'
    });
    expect(updated.level).toBe('Mid');
  });

  it('should throw error when updating non-existing job', async () => {
    await expect(
      jobService.updateJob('608d1f2b8e620f1a7c8b4567', { level: 'Mid' })
    ).rejects.toThrow(/not found/);
  });

  it('should delete an existing job', async () => {
    const created = await jobService.createJob(sampleData);
    await expect(
      jobService.deleteJob(created._id.toString())
    ).resolves.toBeUndefined();
    const listAfterDelete = await jobService.listJobs({ limit: 9, skip: 0 });
    expect(listAfterDelete).toHaveLength(0);
  });

  it('should throw error when deleting non-existing job', async () => {
    await expect(
      jobService.deleteJob('608d1f2b8e620f1a7c8b4567')
    ).rejects.toThrow(/not found/);
  });
});
