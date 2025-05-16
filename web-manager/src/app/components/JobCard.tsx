'use client';

import { IJobEntity } from '@/types/IJobEntity';
import Link from 'next/link';

interface JobCardProps {
  job: IJobEntity;
  onLike: (job: IJobEntity) => void;
  onDislike: (job: IJobEntity) => void;
}

function Salary({ job }: {job: IJobEntity}) {
  if (!job || !job.salary) return null;
  const { min, max, currency } = job.salary;
  return (
    <span className="text-sm text-gray-500">
      { min ? min.toLocaleString('fr-FR', { style: 'currency', currency, maximumFractionDigits: 0 }) : null}
      { min && max ? ' - ' : null}
      { max ? max.toLocaleString('fr-FR', { style: 'currency', currency, maximumFractionDigits: 0 }) : null}
    </span>
  );
}

export default function JobCard({ job, onLike, onDislike }: JobCardProps) {
  const date = job.date ? new Date(job.date) : null;
  return (
    <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center min-h-[60vh] px-4">
      {/* Bouton NOPE gauche */}
      <button
        onClick={() => onDislike(job)}
        className="absolute left-0 flex flex-col items-center px-4 py-2 text-gray-500 hover:text-red-600 transition group"
      >
        <div className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center group-hover:border-red-400">
          <span className="text-2xl">✕</span>
        </div>
        <span className="text-sm mt-2">NOPE</span>
      </button>

      {/* Carte principale */}
      <div className="bg-white rounded-xl p-8 shadow-sm w-full max-w-xl text-center">
        <div className="text-left">
          <h2 className="text-xl font-bold">{job.title}</h2>
          <p className="text-gray-700 font-medium">{job.company}</p>
          <p className="text-gray-500 text-sm">
            {job.location}
            {job.contract_type ? ' · ' : null}
            {job.contract_type}
            {date ? ' · ' : null}
            {date ? date.toLocaleDateString() : null}
            {job.salary && (job.salary.min || job.salary.max) ? ' · ' : null}
            {job.salary ? <Salary job={job} /> : null}
          </p>
          <p className="mt-4 text-gray-700">{job.description}</p>
          <Link href={job.source} target="_blank" className="mt-4 inline-block text-blue-500 hover:underline">
            Source
          </Link>
        </div>
      </div>

      {/* Bouton LIKE droite */}
      <button
        onClick={() => onLike(job)}
        className="absolute right-0 flex flex-col items-center px-4 py-2 text-gray-500 hover:text-green-600 transition group"
      >
        <div className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center group-hover:border-green-400">
          <span className="text-2xl">♥</span>
        </div>
        <span className="text-sm mt-2">LIKE</span>
      </button>
    </div>
  );
}