'use client';

import { IJob } from '@/models/IJob';
import { useState, FormEvent, useEffect } from 'react';

interface JobFormData {
  title: string;
  company: string;
  contract_type: string;
  date: string;
  description: string;
  interest_indicator: string;
  level: string;
  location: string;
  methodology: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  source: string;
  teleworking: boolean;
}

interface JobCreateProps {
  onCreated: () => void;
  onCancel: () => void;
  job?: IJob;
}

/**
 * JobCreate component renders a form to create or edit a Job.
 * Calls onCreated on success, onCancel to abort.
 */
export default function JobCreate({ onCreated, onCancel, job }: JobCreateProps) {
  // Initialize form state from job when editing
  const [form, setForm] = useState<JobFormData>({
    title: '', company: '', contract_type: '', date: '', description: '',
    interest_indicator: '', level: '', location: '', methodology: '',
    salaryMin: 0, salaryMax: 0, currency: 'EUR', source: '', teleworking: false,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (job) {
      setForm({
        title: job.title,
        company: job.company,
        contract_type: job.contract_type ?? '',
        date: job.date,
        description: job.description,
        interest_indicator: job.interest_indicator,
        level: job.level ?? '',
        location: job.location,
        methodology: job.methodology.join(', '),
        salaryMin: job.salary.min ?? 0,
        salaryMax: job.salary.max ?? 0,
        currency: job.salary.currency,
        source: job.source,
        teleworking: job.teleworking,
      });
    }
  }, [job]);

  /**
   * Handles form field changes.
   */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  /**
   * Submits form data and invokes onCreated on success.
   */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const payload: Partial<IJob> = {
        title: form.title,
        company: form.company,
        contract_type: form.contract_type || null,
        date: form.date,
        description: form.description,
        interest_indicator: form.interest_indicator,
        level: form.level || null,
        location: form.location,
        methodology: form.methodology.split(',').map(s => s.trim()),
        salary: {
          currency: form.currency,
          min: form.salaryMin,
          max: form.salaryMax,
        },
        source: form.source,
        technologues: null,
        teleworking: form.teleworking,
      };

      const url = job ? `/api/jobs/${job._id.toString()}` : '/api/jobs';
      const method = job ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      onCreated();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-4">
        {job ? 'Edit Job' : 'Create New Job'}
      </h2>
      {error && <p className="text-red-600 mb-2">Error: {error}</p>}

      {/* Title */}
      <label className="block mb-2">
        <span>Title</span>
        <input name="title" value={form.title} onChange={handleChange} required className="mt-1 block w-full border rounded p-2" />
      </label>

      {/* Company */}
      <label className="block mb-2">
        <span>Company</span>
        <input name="company" value={form.company} onChange={handleChange} required className="mt-1 block w-full border rounded p-2" />
      </label>

      {/* Location */}
      <label className="block mb-2">
        <span>Location</span>
        <input name="location" value={form.location} onChange={handleChange} required className="mt-1 block w-full border rounded p-2" />
      </label>

      {/* Contract Type */}
      <label className="block mb-2">
        <span>Contract Type</span>
        <input name="contract_type" value={form.contract_type} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
      </label>

      {/* Date */}
      <label className="block mb-2">
        <span>Date</span>
        <input type="date" name="date" value={form.date} onChange={handleChange} required className="mt-1 block w-full border rounded p-2" />
      </label>

      {/* Description */}
      <label className="block mb-2">
        <span>Description</span>
        <textarea name="description" value={form.description} onChange={handleChange} required className="mt-1 block w-full border rounded p-2" />
      </label>

      {/* Interest Indicator */}
      <label className="block mb-2">
        <span>Interest Indicator</span>
        <input name="interest_indicator" value={form.interest_indicator} onChange={handleChange} required className="mt-1 block w-full border rounded p-2" />
      </label>

      {/* Level */}
      <label className="block mb-2">
        <span>Level</span>
        <input name="level" value={form.level} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
      </label>

      {/* Methodology */}
      <label className="block mb-2">
        <span>Methodology (comma-separated)</span>
        <input name="methodology" value={form.methodology} onChange={handleChange} required className="mt-1 block w-full border rounded p-2" />
      </label>

      {/* Salary fields and other inputs omitted for brevity */}

      <div className="flex space-x-4 mt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          {job ? 'Update' : 'Submit'}
        </button>
      </div>
    </form>
  );
}
