import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { CvService } from '@/backend/services/CvService';
import { ICV } from '../models/ICV';
import { ApiLogger } from '@/errors/ApiLogger';
import { ApiError } from '@/errors/ApiError';

let mongoServer: MongoMemoryServer | null = null;
let cvService: CvService;

// Mock ApiLogger to prevent actual logging during tests
jest.spyOn(ApiLogger.prototype, 'info').mockImplementation(async () => {});
jest.spyOn(ApiLogger.prototype, 'warn').mockImplementation(async () => {});
jest.spyOn(ApiLogger.prototype, 'error').mockImplementation(async () => {});
jest.spyOn(ApiError.prototype, 'log').mockImplementation(async () => {});

// Start in-memory MongoDB server before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const dbUri = mongoServer.getUri();

  cvService = CvService.getInstance({ dbUri });
});

// Clear database after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  if (collections) {
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

// Stop server and disconnect after all tests
afterAll(async () => {
  // Ensure cvService is properly destroyed
  await cvService.destroy();
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

describe('CVService Integration Tests', () => {
  // Sample CV data for testing
  const sampleData: Partial<ICV> = {
    first_name: 'John',
    last_name: 'Doe',
    title: 'Software Engineer',
    birth_date: new Date('1990-01-01'),
    city: 'Paris',
    country: 'France',
    email: 'john.doe@davidlefrancq.fr',
    phone: '1234567890',
    linkedin: 'https://www.linkedin.com/in/johndoe',
    github: 'https://github.com/davidlefrancq',
    website: 'https://johndoe.com',
    driving_license: true,
    experiences: [
      {
        title: 'Junior Developer',
        company: 'TechCorp',
        location: 'Paris',
        dateStart: new Date('2020-01-01'),
        dateEnd: new Date('2021-01-01'),
        description: 'Worked on various projects',
        isAlternance: false,
      },
    ],
    education: [
      {
        title: 'Bachelor in Computer Science',
        institution: 'University of Paris',
        location: 'Paris',
        dateStart: new Date('2015-09-01'),
        dateEnd: new Date('2018-06-01'),
        description: 'Studied computer science fundamentals',
      },
    ],
    skills: ['JavaScript', 'Node.js', 'React'],
    interests: ['Coding', 'Gaming'],
    created_at: new Date(),
    updated_at: new Date(),
  };

  it('should create and return a new cv', async () => {
    const created = await cvService.createCv(sampleData);
    expect(created._id).toBeDefined();
    expect(created.title).toBe(sampleData.title);
  });

  it('should list all cvs', async () => {
    await cvService.createCv(sampleData);
    const list = await cvService.listCvs({ limit:9, skip:0 });
    expect(Array.isArray(list)).toBe(true);
    expect(list).toHaveLength(1);
  });

  it('should retrieve a cv by id', async () => {
    const created = await cvService.createCv(sampleData);
    const fetched = await cvService.getCvById(created._id.toString());
    expect(fetched).not.toBeNull();
    expect(fetched.title).toBe(sampleData.title);
    expect(fetched.first_name).toBe(sampleData.first_name);
    expect(fetched.last_name).toBe(sampleData.last_name);
    expect(fetched.email).toBe(sampleData.email);
    expect(fetched.phone).toBe(sampleData.phone);
    expect(fetched.linkedin).toBe(sampleData.linkedin);
    expect(fetched.github).toBe(sampleData.github);
    expect(fetched.website).toBe(sampleData.website);
    expect(fetched.driving_license).toBe(sampleData.driving_license);
    expect(fetched.experiences).toHaveLength(1);
    expect(fetched.education).toHaveLength(1);
    expect(fetched.skills).toEqual(expect.arrayContaining(sampleData.skills || []));
    expect(fetched.interests).toEqual(expect.arrayContaining(sampleData.interests || []));
    expect(fetched.created_at).toBeDefined();
    expect(fetched.updated_at).toBeDefined();

    const experience = fetched.experiences[0];
    expect(experience.title).toBe(sampleData.experiences![0].title);
    expect(experience.company).toBe(sampleData.experiences![0].company);
    expect(experience.location).toBe(sampleData.experiences![0].location);
    expect(experience.dateStart).toEqual(sampleData.experiences![0].dateStart);
    expect(experience.dateEnd).toEqual(sampleData.experiences![0].dateEnd);
    expect(experience.description).toBe(sampleData.experiences![0].description);
    expect(experience.isAlternance).toBe(sampleData.experiences![0].isAlternance);

    const education = fetched.education[0];
    expect(education.title).toBe(sampleData.education![0].title);
    expect(education.institution).toBe(sampleData.education![0].institution);
    expect(education.location).toBe(sampleData.education![0].location);
    expect(education.dateStart).toEqual(sampleData.education![0].dateStart);
    expect(education.dateEnd).toEqual(sampleData.education![0].dateEnd);
    expect(education.description).toBe(sampleData.education![0].description);
  });

  it('should throw error when retrieving non-existing cv', async () => {
    await expect(cvService.getCvById('608d1f2b8e620f1a7c8b4567')).rejects.toThrow(
      /Fail while retrieving CV by ID./
    );
  });

  it('should update an existing cv', async () => {
    const created = await cvService.createCv(sampleData);
    const updated = await cvService.updateCv(created._id.toString(), {
      city: 'Gap'
    });
    expect(updated).toBeDefined();
    expect(updated?.city).toBe('Gap');
  });

  it('should throw error when updating non-existing cv', async () => {
    await expect(
      cvService.updateCv('608d1f2b8e620f1a7c8b4567', { city: 'Gap' })
    ).rejects.toThrow(/Fail while updating CV./);
  });

  it('should delete an existing cv', async () => {
    const created = await cvService.createCv(sampleData);
    await expect(
      cvService.deleteCv(created._id.toString())
    ).resolves.toBeTruthy();
    const listAfterDelete = await cvService.listCvs({ limit: 9, skip: 0 });
    expect(listAfterDelete).toHaveLength(0);
  });

  it('should throw error when deleting non-existing cv', async () => {
    await expect(
      cvService.deleteCv('608d1f2b8e620f1a7c8b4567')
    ).rejects.toThrow(/Fail while deleting CV./);
  });
});
