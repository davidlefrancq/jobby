import { JobSanitizer } from '@/backend/models/JobSanitizer';
import { ApiLogger } from '@/errors/ApiLogger';
import { ApiError } from '@/errors/ApiError';
import { ICompanyCA, ICompanyDetails, ICompanyLeadership, ICompanyLocation, ICompanyMarketPositioning, ICompanyNafApe, ICompanyShareCapital, IJobEntity, ISalary } from '@/types/IJobEntity';

// Mock ApiLogger to prevent actual logging during tests
jest.spyOn(ApiLogger.prototype, 'info').mockImplementation(async () => {});
jest.spyOn(ApiLogger.prototype, 'warn').mockImplementation(async () => {});
jest.spyOn(ApiLogger.prototype, 'error').mockImplementation(async () => {});
jest.spyOn(ApiError.prototype, 'log').mockImplementation(async () => {});

const data_valid: IJobEntity = {
  title: 'DevOps Engineer',
  collective_agreement: "Bureaux d'études techniques SYNTEC (1486)",
  company: "Google",
  company_details: {
    clients: ["Apple", "Microsoft", "Amazon", "Facebook", "Tesla", "Netflix", "IBM"],
    creation_date: new Date('2000-01-01'),
    description: "A leading tech company",
    global_workforce: 100000,
    leadership: [
      {
        name: "Sundar Pichai",
        position: "CEO",
        email: "sundar.pichai@gmail.com",
        github: "https://github.com/sundarpichai",
        linkedin: "https://www.linkedin.com/in/sundar-pichai",
        phone: "1234567890",
        twitter: "https://twitter.com/sundarpichai",
        website: "https://www.google.com"
      },
      {
        name: "Ruth Porat",
        position: "CFO",
        email: "ruth.porat@gmail.com",
        github: "https://github.com/ruthporat",
        linkedin: "https://www.linkedin.com/in/ruth-porat",
        phone: "0987654321",
        twitter: "https://twitter.com/ruthporat",
        website: "https://www.google.com"
      }
    ],
    legal_form: "Société Anonyme",
    locations: [
      {
        address: "8 RUE DE LONDRES",
        city: "PARIS",
        country: "France",
        postal_code: "75009",
        latitude: 48.8769377,
        longitude: 2.3299804,
        siret: "44306184100047",
        workforce: 50000
      }
    ],
    logo: "https://www.google.com/logo.png",
    market_positioning: {
      competitors: ["Apple", "Microsoft", "Amazon"],
      differentiators: ["Innovative AI", "Cloud Services", "Search Engine"]
    },
    products: ["Search Engine", "Cloud Services", "Advertising"],
    revenue: [
      {
        amount: 182000000000,
        currency: "USD",
        siret: "12345678901234",
        year: 2020
      }
    ],
    sector: "Technology",
    share_capital: {
      amount: 100000000,
      currency: "USD"
    },
    siren: "443061841",
    naf_ape: {
      code: "6201Z",
      activity: "Programmation informatique"
    },
    website: "https://www.google.com"
  },
  content: "This is a job description for a DevOps Engineer position at Google.",
  contract_type: 'Full-time',
  date: '2025-05-01',
  description: 'Test job',
  interest_indicator: '🟢',
  language: 'English',
  level: 'senior',
  location: 'Paris - France',
  methodologies: ['Agile', 'Scrum'],
  motivation_letter: "This is a motivation letter for the job.",
  motivation_email: "This is a motivation email for the job.",
  motivation_email_subject: "Application for DevOps Engineer Position",
  motivation_email_to: "address.mail@gmail.com",
  motivation_email_draft_url: "https://drafts.google.com/motivation-email",
  original_job_id: "1234567890",
  preference: 'like',
  salary: {
    currency: 'EUR',
    min: 3000,
    max: 5000
  },
  source: "https://www.google.com/jobs/devops-engineer",
  technologies: ["Docker", "Kubernetes", "Terraform"],
  teleworking: false,
  cv_id: 'cv_id',
  metadata: 'metadata',
  original_mail_id: '1234567890',
  processing_stage: 'initialized',
}

// Test JobSanitizer with valid data
describe('JobSanitizer Tests', () => {
  // Test sanitize with valid data
  it('should sanitize valid job data', () => {
    const sanitizedJob = JobSanitizer.sanitize(data_valid);
    expect(sanitizedJob).toBeDefined();
    expect(sanitizedJob.title).toBe(data_valid.title);
    expect(sanitizedJob.company).toBe(data_valid.company);
    expect(sanitizedJob.collective_agreement).toBe(data_valid.collective_agreement);
    
    // Check company details
    expect(sanitizedJob.company_details).toBeDefined();
    expect(sanitizedJob.company_details?.clients?.length).toEqual(data_valid.company_details?.clients?.length);
    expect(sanitizedJob.company_details?.leadership?.length).toEqual(data_valid.company_details?.leadership?.length);
    
    // Check company details: leadership
    const leadership = sanitizedJob.company_details?.leadership ? sanitizedJob.company_details?.leadership[0] : null;
    const leadershipExpected = data_valid.company_details?.leadership ?  data_valid.company_details.leadership[0] : null;
    expect(leadership?.email).toBe(leadershipExpected?.email);
    expect(leadership?.github).toBe(leadershipExpected?.github);
    expect(leadership?.linkedin).toBe(leadershipExpected?.linkedin);
    expect(leadership?.name).toBe(leadershipExpected?.name);
    expect(leadership?.phone).toBe(leadershipExpected?.phone);
    expect(leadership?.twitter).toBe(leadershipExpected?.twitter);
    expect(leadership?.website).toBe(leadershipExpected?.website);
    
    // Check company details: locations
    expect(sanitizedJob.company_details?.locations?.length).toEqual(data_valid.company_details?.locations?.length);
    const location = sanitizedJob.company_details?.locations ? sanitizedJob.company_details?.locations[0] : null;
    const locationExpected = data_valid.company_details?.locations ? data_valid.company_details.locations[0] : null;
    expect(location?.address).toBe(locationExpected?.address);
    expect(location?.city).toBe(locationExpected?.city);
    expect(location?.country).toBe(locationExpected?.country);
    expect(location?.postal_code).toBe(locationExpected?.postal_code);
    expect(location?.latitude).toBe(locationExpected?.latitude);
    expect(location?.longitude).toBe(locationExpected?.longitude);
    expect(location?.siret).toBe(locationExpected?.siret);
    expect(location?.workforce).toBe(locationExpected?.workforce);

    // Check company details: market positioning
    expect(sanitizedJob.company_details?.logo).toBe(data_valid.company_details?.logo);
    expect(sanitizedJob.company_details?.market_positioning).toBeDefined();
    expect(sanitizedJob.company_details?.market_positioning?.competitors?.length).toEqual(data_valid.company_details?.market_positioning?.competitors?.length);
    expect(sanitizedJob.company_details?.market_positioning?.differentiators?.length).toEqual(data_valid.company_details?.market_positioning?.differentiators?.length);
    expect(sanitizedJob.company_details?.products?.length).toEqual(data_valid.company_details?.products?.length);
    expect(sanitizedJob.company_details?.revenue?.length).toEqual(data_valid.company_details?.revenue?.length);
    
    // Check company details: revenue
    const revenue = sanitizedJob.company_details?.revenue ? sanitizedJob.company_details?.revenue[0] : null;
    const revenueExpected = data_valid.company_details?.revenue ? data_valid.company_details.revenue[0] : null;
    expect(revenue?.amount).toBe(revenueExpected?.amount);
    expect(revenue?.currency).toBe(revenueExpected?.currency);
    expect(revenue?.siret).toBe(revenueExpected?.siret);
    expect(revenue?.year).toBe(revenueExpected?.year);
    
    // Check company details: share capital
    expect(sanitizedJob.company_details?.share_capital).toBeDefined();
    expect(sanitizedJob.company_details?.share_capital?.amount).toBe(data_valid.company_details?.share_capital?.amount);
    expect(sanitizedJob.company_details?.share_capital?.currency).toBe(data_valid.company_details?.share_capital?.currency);
    expect(sanitizedJob.company_details?.siren).toBe(data_valid.company_details?.siren);
    expect(sanitizedJob.company_details?.naf_ape).toBeDefined();
    expect(sanitizedJob.company_details?.naf_ape?.code).toBe(data_valid.company_details?.naf_ape?.code);
    expect(sanitizedJob.company_details?.naf_ape?.activity).toBe(data_valid.company_details?.naf_ape?.activity);
    expect(sanitizedJob.company_details?.website).toBe(data_valid.company_details?.website);
    
    // Check other job fields
    expect(sanitizedJob.content).toBe(data_valid.content);
    expect(sanitizedJob.contract_type).toBe(data_valid.contract_type);
    expect(sanitizedJob.cv_id).toBe(data_valid.cv_id);
    expect(sanitizedJob.date).toBe(data_valid.date);
    expect(sanitizedJob.description).toBe(data_valid.description);
    expect(sanitizedJob.interest_indicator).toBe(data_valid.interest_indicator);
    expect(sanitizedJob.language).toBe(data_valid.language);
    expect(sanitizedJob.level).toBe(data_valid.level);
    expect(sanitizedJob.location).toBe(data_valid.location);
    expect(sanitizedJob.methodologies).toEqual(data_valid.methodologies);
    expect(sanitizedJob.motivation_letter).toBe(data_valid.motivation_letter);
    expect(sanitizedJob.motivation_email).toBe(data_valid.motivation_email);
    expect(sanitizedJob.motivation_email_subject).toBe(data_valid.motivation_email_subject);
    expect(sanitizedJob.motivation_email_to).toBe(data_valid.motivation_email_to);
    expect(sanitizedJob.motivation_email_draft_url).toBe(data_valid.motivation_email_draft_url);
    expect(sanitizedJob.original_job_id).toBe(data_valid.original_job_id);
    expect(sanitizedJob.original_mail_id).toBe(data_valid.original_mail_id);
    expect(sanitizedJob.preference).toBe(data_valid.preference);
    expect(sanitizedJob.processing_stage).toBe(data_valid.processing_stage);
    expect(sanitizedJob.salary?.currency).toBe(data_valid.salary?.currency);
    expect(sanitizedJob.salary?.min).toBe(data_valid.salary?.min);
    expect(sanitizedJob.salary?.max).toBe(data_valid.salary?.max);
    expect(sanitizedJob.source).toBe(data_valid.source);
    expect(sanitizedJob.technologies).toEqual(data_valid.technologies);
    expect(sanitizedJob.teleworking).toBe(data_valid.teleworking);
    expect(sanitizedJob.metadata).toBe(data_valid.metadata);
  })
})

// Test JobSanitizer with empty data
describe('JobSanitizer Empty Data Tests', () => {
  // Test sanitize with empty title
  it('should sanitize job data with empty title', () => {
    const data_with_empty_title = { ...data_valid, title: '' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_title);
    expect(sanitizedJob.title).toBe('unknown');
  });
  // Test sanitize with empty company
  it('should sanitize job data with empty company', () => {
    const data_with_empty_company = { ...data_valid, company: '' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_company);
    expect(sanitizedJob.company).toBe(null);
  });
  // Test sanitize with empty collective_agreement
  it('should sanitize job data with empty collective_agreement', () => {
    const data_with_empty_collective_agreement = { ...data_valid, collective_agreement: '' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_collective_agreement);
    expect(sanitizedJob.collective_agreement).toBe(null);
  });
  // Test sanitize with empty company_details
  it('should sanitize job data with empty company_details', () => {
    const company_details: ICompanyDetails = {} as unknown as ICompanyDetails;
    const data_with_empty_company_details = { ...data_valid, company_details };
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_company_details);
    expect(sanitizedJob.company_details).toBeDefined();
    expect(sanitizedJob.company_details?.clients).toBeNull();
    expect(sanitizedJob.company_details?.creation_date).toBeNull();
    expect(sanitizedJob.company_details?.description).toBeNull();
    expect(sanitizedJob.company_details?.global_workforce).toBeNull();
    expect(sanitizedJob.company_details?.leadership).toBeNull();
    expect(sanitizedJob.company_details?.legal_form).toBeNull();
    expect(sanitizedJob.company_details?.locations).toBeNull();
    expect(sanitizedJob.company_details?.logo).toBeNull();
    expect(sanitizedJob.company_details?.market_positioning).toBeNull();
    expect(sanitizedJob.company_details?.products).toBeNull();
    expect(sanitizedJob.company_details?.revenue).toBeNull();
    expect(sanitizedJob.company_details?.share_capital).toBeNull();
    expect(sanitizedJob.company_details?.siren).toBeNull();
    expect(sanitizedJob.company_details?.naf_ape).toBeNull();
    expect(sanitizedJob.company_details?.website).toBeNull();
  });
  // Test sanitize with empty contract_type
  it('should sanitize job data with empty contract_type', () => {
    const data_with_empty_contract_type = { ...data_valid, contract_type: '' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_contract_type);
    expect(sanitizedJob.contract_type).toBe(null);
  });
  // Test sanitize with empty date
  it('should sanitize job data with empty date', () => {
    const data_with_empty_date = { ...data_valid, date: '' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_date);
    expect(sanitizedJob.date).toBe(null);
  });
  // Test sanitize with empty description
  it('should sanitize job data with empty description', () => {
    const data_with_empty_description = { ...data_valid, description: '' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_description);
    expect(sanitizedJob.description).toBe(null);
  });
  // Test sanitize with empty interest_indicator
  it('should sanitize job data with empty interest_indicator', () => {
    const data_with_empty_interest_indicator = { ...data_valid, interest_indicator: '' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_interest_indicator);
    expect(sanitizedJob.interest_indicator).toBe(null);
  });
  // Test sanitize with empty level
  it('should sanitize job data with empty level', () => {
    const data_with_empty_level = { ...data_valid, level: '' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_level);
    expect(sanitizedJob.level).toBe(null);
  });
  // Test sanitize with empty language
  it('should sanitize job data with empty language', () => {
    const data_with_empty_language = { ...data_valid, language: '' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_language);
    expect(sanitizedJob.language).toBe(null);
  });
  // Test sanitize with empty location
  it('should sanitize job data with empty location', () => {
    const data_with_empty_location = { ...data_valid, location: '' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_location);
    expect(sanitizedJob.location).toBe(null);
  });
  // Test sanitize with empty methodologies
  it('should sanitize job data with empty methodologies', () => {
    const data_with_empty_methodologies = { ...data_valid, methodologies: [] };
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_methodologies);
    expect(sanitizedJob.methodologies).toEqual([]);
  });
  // Test sanitize with empty motivation_letter
  it('should sanitize job data with empty motivation_letter', () => {
    const data_with_empty_motivation_letter = { ...data_valid, motivation_letter: '' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_motivation_letter);
    expect(sanitizedJob.motivation_letter).toBe(null);
  });
  // Test sanitize with empty motivation_email
  it('should sanitize job data with empty motivation_email', () => {
    const data_with_empty_motivation_email = { ...data_valid, motivation_email: '' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_motivation_email);
    expect(sanitizedJob.motivation_email).toBe(null);
  });
  // Test sanitize with empty motivation_email_subject
  it('should sanitize job data with empty motivation_email_subject', () => {
    const data_with_empty_motivation_email_subject = { ...data_valid, motivation_email_subject: '' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_motivation_email_subject);
    expect(sanitizedJob.motivation_email_subject).toBe(null);
  });
  // Test sanitize with empty motivation_email_to
  it('should sanitize job data with empty motivation_email_to', () => {
    const data_with_empty_motivation_email_to = { ...data_valid, motivation_email_to: '' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_motivation_email_to);
    expect(sanitizedJob.motivation_email_to).toBe(null);
  });
  // Test sanitize with empty motivation_email_draft_url
  it('should sanitize job data with empty motivation_email_draft_url', () => {
    const data_with_empty_motivation_email_draft_url = { ...data_valid, motivation_email_draft_url: '' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_motivation_email_draft_url);
    expect(sanitizedJob.motivation_email_draft_url).toBe(null);
  });
  // Test sanitize with empty original_job_id
  it('should sanitize job data with empty original_job_id', () => {
    const data_with_empty_original_job_id = { ...data_valid, original_job_id: '' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_original_job_id);
    expect(sanitizedJob.original_job_id).toBe(null);
  });
  // Test sanitize with empty preference
  it('should sanitize job data with empty preference', () => {
    const data_with_empty_preference = { ...data_valid, preference: '' } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_preference);
    expect(sanitizedJob.preference).toBe(null);
  });
  // Test sanitize with empty salary
  it('should sanitize job data with empty salary', () => {
    const salary: ISalary = {} as unknown as ISalary;
    const data_with_empty_salary = { ...data_valid, salary };
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_salary);
    expect(sanitizedJob.salary).toBeDefined();
    expect(sanitizedJob.salary?.currency).toBe(null);
    expect(sanitizedJob.salary?.min).toBe(null);
    expect(sanitizedJob.salary?.max).toBe(null);
  });
  // Test sanitize with empty source
  it('should sanitize job data with empty source', () => {
    const data_with_empty_source = { ...data_valid, source: '' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_source);
    expect(sanitizedJob.source).toBe(null);
  });
  // Test sanitize with empty technologies
  it('should sanitize job data with empty technologies', () => {
    const data_with_empty_technologies = { ...data_valid, technologies: [] };
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_technologies);
    expect(sanitizedJob.technologies).toEqual([]);
  });
  // Test sanitize with empty teleworking
  it('should sanitize job data with empty teleworking', () => {
    const data_with_empty_teleworking = { ...data_valid, teleworking: null } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_teleworking);
    expect(sanitizedJob.teleworking).toBe(false);
  });
  // Test sanitize with empty cv_id
  it('should sanitize job data with empty cv_id', () => {
    const data_with_empty_cv_id = { ...data_valid, cv_id: '' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_cv_id);
    expect(sanitizedJob.cv_id).toBe(null);
  });
  // Test sanitize with empty metadata
  it('should sanitize job data with empty metadata', () => {
    const data_with_empty_metadata = { ...data_valid, metadata: '' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_metadata);
    expect(sanitizedJob.metadata).toBe(null);
  });
  // Test sanitize with empty original_mail_id
  it('should sanitize job data with empty original_mail_id', () => {
    const data_with_empty_original_mail_id = { ...data_valid, original_mail_id: '' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_original_mail_id);
    expect(sanitizedJob.original_mail_id).toBe(null);
  });
  // Test sanitize with empty processing_stage
  it('should sanitize job data with empty processing_stage', () => {
    const data_with_empty_processing_stage = { ...data_valid, processing_stage: '' } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_empty_processing_stage);
    expect(sanitizedJob.processing_stage).toBe(null);
  });
})

// Test JobSanitizer with invalid data
describe('JobSanitizer Invalid Data Tests', () => {
  // Test sanitize with invalid title
  it('should sanitize job data with invalid title', () => {
    const data_with_invalid_title = { ...data_valid, title: 123 } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_title);
    expect(sanitizedJob.title).toBe('unknown');
  });
  // Test sanitize with invalid collective_agreement
  it('should sanitize job data with invalid collective_agreement', () => {
    const data_with_invalid_collective_agreement = { ...data_valid, collective_agreement: 123 } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_collective_agreement);
    expect(sanitizedJob.collective_agreement).toBe(null);
  });
  // Test sanitize with invalid company
  it('should sanitize job data with invalid company', () => {
    const data_with_invalid_company = { ...data_valid, company: 123 } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_company);
    expect(sanitizedJob.company).toBe(null);
  });
  // Test sanitize with invalid company_details
  it('should sanitize job data with invalid company_details', () => {
    const company_details: ICompanyDetails = {
      clients: 123, // Invalid type
      creation_date: 'invalid-date' as unknown as Date, // Invalid type
      description: 456, // Invalid type
      global_workforce: 'not-a-number' as unknown as number, // Invalid type
      leadership: 'not-an-array' as unknown as ICompanyLeadership[], // Invalid type
      legal_form: 789, // Invalid type
      locations: 'not-an-array' as unknown as ICompanyLocation[], // Invalid type
      logo: 101112, // Invalid type
      market_positioning: 'not-an-object' as unknown as ICompanyMarketPositioning, // Invalid type
      products: 'not-an-array' as unknown as string[], // Invalid type
      revenue: 'not-an-array' as unknown as ICompanyCA[], // Invalid type
      sector: 131415, // Invalid type
      share_capital: 'not-an-object' as unknown as ICompanyShareCapital, // Invalid type
      siren: 161718, // Invalid type
      naf_ape: 'not-an-object' as unknown as ICompanyNafApe, // Invalid type
      website: 192021, // Invalid type
    } as unknown as ICompanyDetails;
    const data_with_invalid_company_details = { ...data_valid, company_details };
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_company_details);
    expect(sanitizedJob.company_details).toBeDefined();
    expect(sanitizedJob.company_details?.clients?.length).toBe(0);
    expect(sanitizedJob.company_details?.creation_date).toBeNull();
    expect(sanitizedJob.company_details?.description).toBeNull();
    expect(sanitizedJob.company_details?.global_workforce).toBeNull();
    expect(sanitizedJob.company_details?.leadership).toBeNull();
    expect(sanitizedJob.company_details?.legal_form).toBeNull();
    expect(sanitizedJob.company_details?.locations).toBeNull();
    expect(sanitizedJob.company_details?.logo).toBeNull();
    expect(sanitizedJob.company_details?.market_positioning?.competitors).toBeNull();
    expect(sanitizedJob.company_details?.market_positioning?.differentiators).toBeNull();
    expect(sanitizedJob.company_details?.products?.length).toBe(0);
    expect(sanitizedJob.company_details?.revenue).toBeNull();
    expect(sanitizedJob.company_details?.share_capital?.amount).toBe(0);
    expect(sanitizedJob.company_details?.share_capital?.currency).toBeNull();
    expect(sanitizedJob.company_details?.siren).toBeNull();
    expect(sanitizedJob.company_details?.naf_ape?.code).toBeNull();
    expect(sanitizedJob.company_details?.naf_ape?.activity).toBeNull();
    expect(sanitizedJob.company_details?.website).toBeNull();
  });
  // Test sanitize with invalid contract_type
  it('should sanitize job data with invalid contract_type', () => {
    const data_with_invalid_contract_type = { ...data_valid, contract_type: 123 } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_contract_type);
    expect(sanitizedJob.contract_type).toBe(null);
  });
  // Test sanitize with invalid date
  it('should sanitize job data with invalid date', () => {
    const data_with_invalid_date = { ...data_valid, date: 'invalid-date' } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_date);
    expect(sanitizedJob.date).toBe(null);
  });
  // Test sanitize with invalid description
  it('should sanitize job data with invalid description', () => {
    const data_with_invalid_description = { ...data_valid, description: 123 } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_description);
    expect(sanitizedJob.description).toBe(null);
  });
  // Test sanitize with invalid interest_indicator
  it('should sanitize job data with invalid interest_indicator', () => {
    const data_with_invalid_interest_indicator = { ...data_valid, interest_indicator: 123 } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_interest_indicator);
    expect(sanitizedJob.interest_indicator).toBe(null);
  });
  // Test sanitize with invalid level
  it('should sanitize job data with invalid level', () => {
    const data_with_invalid_level = { ...data_valid, level: 123 } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_level);
    expect(sanitizedJob.level).toBe(null);
  });
  // Test sanitize with invalid language
  it('should sanitize job data with invalid language', () => {
    const data_with_invalid_language = { ...data_valid, language: 123 } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_language);
    expect(sanitizedJob.language).toBe(null);
  });
  // Test sanitize with invalid location
  it('should sanitize job data with invalid location', () => {
    const data_with_invalid_location = { ...data_valid, location: 123 } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_location);
    expect(sanitizedJob.location).toBe(null);
  });
  // Test sanitize with invalid methodologies
  it('should sanitize job data with invalid methodologies', () => {
    const data_with_invalid_methodologies = { ...data_valid, methodologies: 'not-an-array' } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_methodologies);
    expect(sanitizedJob.methodologies).toEqual(null);
  });
  // Test sanitize with invalid motivation_letter
  it('should sanitize job data with invalid motivation_letter', () => {
    const data_with_invalid_motivation_letter = { ...data_valid, motivation_letter: 123 } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_motivation_letter);
    expect(sanitizedJob.motivation_letter).toBe(null);
  });
  // Test sanitize with invalid motivation_email
  it('should sanitize job data with invalid motivation_email', () => {
    const data_with_invalid_motivation_email = { ...data_valid, motivation_email: 123 } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_motivation_email);
    expect(sanitizedJob.motivation_email).toBe(null);
  });
  // Test sanitize with invalid motivation_email_subject
  it('should sanitize job data with invalid motivation_email_subject', () => {
    const data_with_invalid_motivation_email_subject = { ...data_valid, motivation_email_subject: 123 } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_motivation_email_subject);
    expect(sanitizedJob.motivation_email_subject).toBe(null);
  });
  // Test sanitize with invalid motivation_email_to
  it('should sanitize job data with invalid motivation_email_to', () => {
    const data_with_invalid_motivation_email_to = { ...data_valid, motivation_email_to: 123 } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_motivation_email_to);
    expect(sanitizedJob.motivation_email_to).toBe(null);
  });
  // Test sanitize with invalid motivation_email_draft_url
  it('should sanitize job data with invalid motivation_email_draft_url', () => {
    const data_with_invalid_motivation_email_draft_url = { ...data_valid, motivation_email_draft_url: 123 } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_motivation_email_draft_url);
    expect(sanitizedJob.motivation_email_draft_url).toBe(null);
  });
  // Test sanitize with invalid original_job_id
  it('should sanitize job data with invalid original_job_id', () => {
    const data_with_invalid_original_job_id = { ...data_valid, original_job_id: 123 } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_original_job_id);
    expect(sanitizedJob.original_job_id).toBe(null);
  });
  // Test sanitize with invalid preference
  it('should sanitize job data with invalid preference', () => {
    const data_with_invalid_preference = { ...data_valid, preference: 123 } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_preference);
    expect(sanitizedJob.preference).toBe(null);
  });
  // Test sanitize with invalid salary
  it('should sanitize job data with invalid salary', () => {
    const salary: ISalary = {
      currency: 123, // Invalid type
      min: 'not-a-number' as unknown as number, // Invalid type
      max: 'not-a-number' as unknown as number // Invalid type
    } as unknown as ISalary;
    const data_with_invalid_salary = { ...data_valid, salary };
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_salary);
    expect(sanitizedJob.salary).toBeDefined();
    expect(sanitizedJob.salary?.currency).toBe(null);
    expect(sanitizedJob.salary?.min).toBe(null);
    expect(sanitizedJob.salary?.max).toBe(null);
  });
  // Test sanitize with invalid source
  it('should sanitize job data with invalid source', () => {
    const data_with_invalid_source = { ...data_valid, source: 123 } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_source);
    expect(sanitizedJob.source).toBe(null);
  });
  // Test sanitize with invalid technologies
  it('should sanitize job data with invalid technologies', () => {
    const data_with_invalid_technologies = { ...data_valid, technologies: 'not-an-array' } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_technologies);
    expect(sanitizedJob.technologies).toEqual(null);
  });
  // Test sanitize with invalid teleworking
  it('should sanitize job data with invalid teleworking', () => {
    const data_with_invalid_teleworking = { ...data_valid, teleworking: 'not-a-boolean' } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_teleworking);
    expect(sanitizedJob.teleworking).toBe(false);
  });
  // Test sanitize with invalid cv_id
  it('should sanitize job data with invalid cv_id', () => {
    const data_with_invalid_cv_id = { ...data_valid, cv_id: 123 } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_cv_id);
    expect(sanitizedJob.cv_id).toBe(null);
  });
  // Test sanitize with invalid metadata
  it('should sanitize job data with invalid metadata', () => {
    const data_with_invalid_metadata = { ...data_valid, metadata: 123 } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_metadata);
    expect(sanitizedJob.metadata).toBe(null);
  });
  // Test sanitize with invalid original_mail_id
  it('should sanitize job data with invalid original_mail_id', () => {
    const data_with_invalid_original_mail_id = { ...data_valid, original_mail_id: 123 } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_original_mail_id);
    expect(sanitizedJob.original_mail_id).toBe(null);
  });
  // Test sanitize with invalid processing_stage
  it('should sanitize job data with invalid processing_stage', () => {
    const data_with_invalid_processing_stage = { ...data_valid, processing_stage: 123 } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_invalid_processing_stage);
    expect(sanitizedJob.processing_stage).toBe(null);
  });
})

// Test JobSanitizer with hacked data
describe('JobSanitizer Hacked Data Tests', () => {
  // Test sanitize with hacked title
  it('should sanitize job data with hacked title', () => {
    const data_with_hacked_title = { ...data_valid, title: '<script>alert("XSS")</script>' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_title);
    expect(sanitizedJob.title).toBe('unknown');
  });
  // Test sanitize with hacked collective_agreement
  it('should sanitize job data with hacked collective_agreement', () => {
    const data_with_hacked_collective_agreement = { ...data_valid, collective_agreement: '<script>alert("XSS")</script>' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_collective_agreement);
    expect(sanitizedJob.collective_agreement).toBe(null);
  });
  // Test sanitize with hacked company
  it('should sanitize job data with hacked company', () => {
    const data_with_hacked_company = { ...data_valid, company: '<script>alert("XSS")</script>' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_company);
    expect(sanitizedJob.company).toBe(null);
  });
  // Test sanitize with hacked company_details
  it('should sanitize job data with hacked company_details', () => {
    const company_details: ICompanyDetails = {
      clients: ['<script>alert("XSS")</script>'],
      creation_date: '<script>alert("XSS")</script>' as unknown as Date,
      description: '<script>alert("XSS")</script>',
      global_workforce: '<script>alert("XSS")</script>' as unknown as number,
      leadership: [
        {
          name: '<script>alert("XSS")</script>',
          position: '<script>alert("XSS")</script>',
          email: '<script>alert("XSS")</script>',
          github: '<script>alert("XSS")</script>',
          linkedin: '<script>alert("XSS")</script>',
          phone: '<script>alert("XSS")</script>',
          twitter: '<script>alert("XSS")</script>',
          website: '<script>alert("XSS")</script>'
        }
      ],
      legal_form: '<script>alert("XSS")</script>',
      locations: [
        {
          address: '<script>alert("XSS")</script>',
          city: '<script>alert("XSS")</script>',
          country: '<script>alert("XSS")</script>',
          postal_code: '<script>alert("XSS")</script>',
          latitude: '<script>alert("XSS")</script>' as unknown as number,
          longitude: '<script>alert("XSS")</script>' as unknown as number,
          siret: '<script>alert("XSS")</script>',
          workforce: '<script>alert("XSS")</script>' as unknown as number
        }
      ],
      logo: '<script>alert("XSS")</script>',
      market_positioning: {
        competitors: ['<script>alert("XSS")</script>'],
        differentiators: ['<script>alert("XSS")</script>']
      },
      products: ['<script>alert("XSS")</script>'],
      revenue: [
        {
          amount: '<script>alert("XSS")</script>' as unknown as number,
          currency: '<script>alert("XSS")</script>',
          siret: '<script>alert("XSS")</script>',
          year: '<script>alert("XSS")</script>' as unknown as number
        }
      ],
      sector: '<script>alert("XSS")</script>',
      share_capital: {
        amount: '<script>alert("XSS")</script>' as unknown as number,
        currency: '<script>alert("XSS")</script>'
      },
      siren: '<script>alert("XSS")</script>',
      naf_ape: {
        code: '<script>alert("XSS")</script>',
        activity: '<script>alert("XSS")</script>'
      },
      website: '<script>alert("XSS")</script>'
    };
    const data_with_hacked_company_details = { ...data_valid, company_details };
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_company_details);
    expect(sanitizedJob.company_details).toBeDefined();
    expect(sanitizedJob.company_details?.clients?.length).toBe(0);
    expect(sanitizedJob.company_details?.creation_date).toBeNull();
    expect(sanitizedJob.company_details?.description).toBeNull();
    expect(sanitizedJob.company_details?.global_workforce).toBeNull();
    const leadership = sanitizedJob.company_details?.leadership ? sanitizedJob.company_details?.leadership[0] : null;
    expect(leadership).toBeDefined();
    expect(leadership?.email).toBeNull();
    expect(leadership?.github).toBeNull();
    expect(leadership?.linkedin).toBeNull();
    expect(leadership?.name).toBeNull();
    expect(leadership?.phone).toBeNull();
    expect(leadership?.twitter).toBeNull();
    expect(leadership?.website).toBeNull();
    expect(sanitizedJob.company_details?.legal_form).toBeNull();
    const location = sanitizedJob.company_details?.locations ? sanitizedJob.company_details?.locations[0] : null;
    expect(location).toBeDefined();
    expect(location?.address).toBeNull();
    expect(location?.city).toBeNull();
    expect(location?.country).toBeNull();
    expect(location?.postal_code).toBeNull();
    expect(location?.latitude).toBeNull();
    expect(location?.longitude).toBeNull();
    expect(location?.siret).toBeNull();
    expect(location?.workforce).toBeNull();
    expect(sanitizedJob.company_details?.logo).toBeNull();
    expect(sanitizedJob.company_details?.market_positioning?.competitors?.length).toBe(0);
    expect(sanitizedJob.company_details?.market_positioning?.differentiators?.length).toBe(0);
    expect(sanitizedJob.company_details?.products?.length).toBe(0);
    const revenue = sanitizedJob.company_details?.revenue ? sanitizedJob.company_details?.revenue[0] : null;
    expect(revenue).toBeDefined();
    expect(revenue?.amount).toBeNull();
    expect(revenue?.currency).toBeNull();
    expect(revenue?.siret).toBe('');
    expect(revenue?.year).toBeNull();
    expect(sanitizedJob.company_details?.sector).toBeNull();
    expect(sanitizedJob.company_details?.share_capital?.amount).toBe(0);
    expect(sanitizedJob.company_details?.share_capital?.currency).toBeNull();
    expect(sanitizedJob.company_details?.siren).toBeNull();
    expect(sanitizedJob.company_details?.naf_ape?.code).toBeNull();
    expect(sanitizedJob.company_details?.naf_ape?.activity).toBeNull();
    expect(sanitizedJob.company_details?.website).toBeNull();
  });
  // Test sanitize with hacked contract_type
  it('should sanitize job data with hacked contract_type', () => {
    const data_with_hacked_contract_type = { ...data_valid, contract_type: '<script>alert("XSS")</script>' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_contract_type);
    expect(sanitizedJob.contract_type).toBe(null);
  });
  // Test sanitize with hacked date
  it('should sanitize job data with hacked date', () => {
    const data_with_hacked_date = { ...data_valid, date: '<script>alert("XSS")</script>' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_date);
    expect(sanitizedJob.date).toBe(null);
  });
  // Test sanitize with hacked description
  it('should sanitize job data with hacked description', () => {
    const data_with_hacked_description = { ...data_valid, description: '<script>alert("XSS")</script>' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_description);
    expect(sanitizedJob.description).toBe(null);
  });
  // Test sanitize with hacked interest_indicator
  it('should sanitize job data with hacked interest_indicator', () => {
    const data_with_hacked_interest_indicator = { ...data_valid, interest_indicator: '<script>alert("XSS")</script>' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_interest_indicator);
    expect(sanitizedJob.interest_indicator).toBe(null);
  });
  // Test sanitize with hacked level
  it('should sanitize job data with hacked level', () => {
    const data_with_hacked_level = { ...data_valid, level: '<script>alert("XSS")</script>' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_level);
    expect(sanitizedJob.level).toBe(null);
  });
  // Test sanitize with hacked language
  it('should sanitize job data with hacked language', () => {
    const data_with_hacked_language = { ...data_valid, language: '<script>alert("XSS")</script>' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_language);
    expect(sanitizedJob.language).toBe(null);
  });
  // Test sanitize with hacked location
  it('should sanitize job data with hacked location', () => {
    const data_with_hacked_location = { ...data_valid, location: '<script>alert("XSS")</script>' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_location);
    expect(sanitizedJob.location).toBe(null);
  });
  // Test sanitize with hacked methodologies
  it('should sanitize job data with hacked methodologies', () => {
    const data_with_hacked_methodologies = { ...data_valid, methodologies: ['<script>alert("XSS")</script>'] };
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_methodologies);
    expect(sanitizedJob.methodologies).toEqual([]);
  });
  // Test sanitize with hacked motivation_letter
  it('should sanitize job data with hacked motivation_letter', () => {
    const data_with_hacked_motivation_letter = { ...data_valid, motivation_letter: '<script>alert("XSS")</script>' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_motivation_letter);
    expect(sanitizedJob.motivation_letter).toBe(null);
  });
  // Test sanitize with hacked motivation_email
  it('should sanitize job data with hacked motivation_email', () => {
    const data_with_hacked_motivation_email = { ...data_valid, motivation_email: '<script>alert("XSS")</script>' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_motivation_email);
    expect(sanitizedJob.motivation_email).toBe(null);
  });
  // Test sanitize with hacked motivation_email_subject
  it('should sanitize job data with hacked motivation_email_subject', () => {
    const data_with_hacked_motivation_email_subject = { ...data_valid, motivation_email_subject: '<script>alert("XSS")</script>' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_motivation_email_subject);
    expect(sanitizedJob.motivation_email_subject).toBe(null);
  });
  // Test sanitize with hacked motivation_email_to
  it('should sanitize job data with hacked motivation_email_to', () => {
    const data_with_hacked_motivation_email_to = { ...data_valid, motivation_email_to: '<script>alert("XSS")</script>' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_motivation_email_to);
    expect(sanitizedJob.motivation_email_to).toBe(null);
  });
  // Test sanitize with hacked motivation_email_draft_url
  it('should sanitize job data with hacked motivation_email_draft_url', () => {
    const data_with_hacked_motivation_email_draft_url = { ...data_valid, motivation_email_draft_url: '<script>alert("XSS")</script>' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_motivation_email_draft_url);
    expect(sanitizedJob.motivation_email_draft_url).toBe(null);
  });
  // Test sanitize with hacked original_job_id
  it('should sanitize job data with hacked original_job_id', () => {
    const data_with_hacked_original_job_id = { ...data_valid, original_job_id: '<script>alert("XSS")</script>' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_original_job_id);
    expect(sanitizedJob.original_job_id).toBe(null);
  });
  // Test sanitize with hacked preference
  it('should sanitize job data with hacked preference', () => {
    const data_with_hacked_preference = { ...data_valid, preference: '<script>alert("XSS")</script>' } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_preference);
    expect(sanitizedJob.preference).toBe(null);
  });
  // Test sanitize with hacked salary
  it('should sanitize job data with hacked salary', () => {
    const salary: ISalary = {
      currency: '<script>alert("XSS")</script>',
      min: '<script>alert("XSS")</script>' as unknown as number,
      max: '<script>alert("XSS")</script>' as unknown as number
    } as unknown as ISalary;
    const data_with_hacked_salary = { ...data_valid, salary };
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_salary);
    expect(sanitizedJob.salary).toBeDefined();
    expect(sanitizedJob.salary?.currency).toBe(null);
    expect(sanitizedJob.salary?.min).toBe(null);
    expect(sanitizedJob.salary?.max).toBe(null);
  });
  // Test sanitize with hacked source
  it('should sanitize job data with hacked source', () => {
    const data_with_hacked_source = { ...data_valid, source: '<script>alert("XSS")</script>' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_source);
    expect(sanitizedJob.source).toBe(null);
  });
  // Test sanitize with hacked technologies
  it('should sanitize job data with hacked technologies', () => {
    const data_with_hacked_technologies = { ...data_valid, technologies: ['<script>alert("XSS")</script>'] };
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_technologies);
    expect(sanitizedJob.technologies).toEqual([]);
  });
  // Test sanitize with hacked teleworking
  it('should sanitize job data with hacked teleworking', () => {
    const data_with_hacked_teleworking = { ...data_valid, teleworking: '<script>alert("XSS")</script>' } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_teleworking);
    expect(sanitizedJob.teleworking).toBe(false);
  });
  // Test sanitize with hacked cv_id
  it('should sanitize job data with hacked cv_id', () => {
    const data_with_hacked_cv_id = { ...data_valid, cv_id: '<script>alert("XSS")</script>' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_cv_id);
    expect(sanitizedJob.cv_id).toBe(null);
  });
  // Test sanitize with hacked metadata
  it('should sanitize job data with hacked metadata', () => {
    const data_with_hacked_metadata = { ...data_valid, metadata: '<script>alert("XSS")</script>' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_metadata);
    expect(sanitizedJob.metadata).toBe(null);
  });
  // Test sanitize with hacked original_mail_id
  it('should sanitize job data with hacked original_mail_id', () => {
    const data_with_hacked_original_mail_id = { ...data_valid, original_mail_id: '<script>alert("XSS")</script>' };
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_original_mail_id);
    expect(sanitizedJob.original_mail_id).toBe(null);
  });
  // Test sanitize with hacked processing_stage
  it('should sanitize job data with hacked processing_stage', () => {
    const data_with_hacked_processing_stage = { ...data_valid, processing_stage: '<script>alert("XSS")</script>' } as unknown as IJobEntity;
    const sanitizedJob = JobSanitizer.sanitize(data_with_hacked_processing_stage);
    expect(sanitizedJob.processing_stage).toBe(null);
  });
})