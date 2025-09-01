
import { JobStatusesChecker } from "../lib/JobStatusesChecker";
import { IJobStatus } from "../interfaces/IJobStatus";

describe("JobStatusesChecker", () => {
  // Base job: all fields at initial state (not started)
  const baseJob = (overrides: Partial<IJobStatus> = {}): IJobStatus => ({
    id: "1",
    title: "Test Job",
    createdAt: new Date(),
    initialized: false,
    outdated: false,
    data_status: null,
    ai_status: null,
    ...overrides,
  });

  const jobs3 = (overrides: Partial<IJobStatus>[] = []) => ({
    a: baseJob({ id: "a", ...(overrides[0] || {}) }),
    b: baseJob({ id: "b", ...(overrides[1] || {}) }),
    c: baseJob({ id: "c", ...(overrides[2] || {}) }),
  });

  describe("isSuccessful", () => {
    it("🟢 returns true when all jobs are initialized and statuses are ok", () => {
      const jobs = jobs3([
        { initialized: true, data_status: "ok", ai_status: "ok" },
        { initialized: true, data_status: "ok", ai_status: "ok" },
        { initialized: true, data_status: "ok", ai_status: "ok" },
      ]);
      expect(JobStatusesChecker.isSuccessful(jobs)).toBe(true);
    });

    it("🔴 returns false if any job is not initialized", () => {
      const jobs = jobs3([
        { initialized: true, data_status: "ok", ai_status: "ok" },
        { initialized: false, data_status: "ok", ai_status: "ok" },
        { initialized: true, data_status: "ok", ai_status: "ok" },
      ]);
      expect(JobStatusesChecker.isSuccessful(jobs)).toBe(false);
    });

    it("🔴 returns false if any job data_status is not ok", () => {
      const jobs = jobs3([
        { initialized: true, data_status: "ok", ai_status: "ok" },
        { initialized: true, data_status: "error", ai_status: "ok" },
        { initialized: true, data_status: "ok", ai_status: "ok" },
      ]);
      expect(JobStatusesChecker.isSuccessful(jobs)).toBe(false);
    });

    it("🔴 returns false if any job ai_status is not ok", () => {
      const jobs = jobs3([
        { initialized: true, data_status: "ok", ai_status: "ok" },
        { initialized: true, data_status: "ok", ai_status: "skipped" },
        { initialized: true, data_status: "ok", ai_status: "ok" },
      ]);
      expect(JobStatusesChecker.isSuccessful(jobs)).toBe(false);
    });
  });

  describe("isFailed", () => {
    it("🟢 returns true when all jobs are initialized and statuses are ok or error", () => {
      const jobs = jobs3([
        { initialized: true, data_status: "ok", ai_status: "error" },
        { initialized: true, data_status: "error", ai_status: "ok" },
        { initialized: true, data_status: "ok", ai_status: "ok" },
      ]);
      expect(JobStatusesChecker.isFailed(jobs)).toBe(true);
    });

    it("🔴 returns false if any job is not initialized", () => {
      const jobs = jobs3([
        { initialized: true, data_status: "ok", ai_status: "ok" },
        { initialized: false, data_status: "ok", ai_status: "ok" },
        { initialized: true, data_status: "ok", ai_status: "ok" },
      ]);
      expect(JobStatusesChecker.isFailed(jobs)).toBe(false);
    });

    it("🔴 returns false if any job data_status is not ok or error", () => {
      const jobs = jobs3([
        { initialized: true, data_status: "ok", ai_status: "ok" },
        { initialized: true, data_status: "processing", ai_status: "ok" },
        { initialized: true, data_status: "ok", ai_status: "ok" },
      ]);
      expect(JobStatusesChecker.isFailed(jobs)).toBe(false);
    });

    it("🔴 returns false if any job ai_status is not ok or error", () => {
      const jobs = jobs3([
        { initialized: true, data_status: "ok", ai_status: "ok" },
        { initialized: true, data_status: "ok", ai_status: "skipped" },
        { initialized: true, data_status: "ok", ai_status: "ok" },
      ]);
      expect(JobStatusesChecker.isFailed(jobs)).toBe(false);
    });
  });
});
