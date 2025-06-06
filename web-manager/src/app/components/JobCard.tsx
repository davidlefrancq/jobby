'use client';

import Link from 'next/link';
import { IJobEntity } from '@/types/IJobEntity';
import LanguageFlag from './LanguageFlag';
import TruncatedText from './TruncatedText';
import JobStatus from './JobStatus';

interface JobCardProps {
  job: IJobEntity;
  onLike: (job: IJobEntity) => void;
  onDislike: (job: IJobEntity) => void;
}

const DotSplitter = () => (<span className="px-1">·</span>);

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
    <div className="relative w-full mx-auto flex items-center justify-center min-h-[40vh] px-4 mb-6">
      {/* Bouton NOPE gauche */}
      <button
        onClick={() => onDislike(job)}
        className="absolute left-0 flex flex-col items-center px-4 py-2 text-gray-500 hover:text-red-600 transition group"
        style={{ cursor: 'pointer' }}
      >
        <div className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center group-hover:border-red-400">
          <span className="text-2xl">✕</span>
        </div>
        <span className="text-sm mt-2">NOPE</span>
      </button>

      {/* Job Card */}
      <div className="bg-white rounded-xl p-8 shadow-lg w-full max-w-7/10 text-center">
        <div className="text-left">
          {/* Job title and company */}
          <h2 className="text-xl font-bold">{job.title}</h2>
          <div className="text-gray-700 font-medium">{job.company}</div>
          {/* Details */}
          <div className="flex text-gray-500 text-sm">
            {/* Language */}
            {job.language ? <LanguageFlag language={job.language} cssClassStyle='mr-1' />: null}
            {/* Location */}
            <span title='Location'>{job.location}</span>
            {/* Contract Type */}
            {job.contract_type ? <DotSplitter /> : null}
            {job.contract_type ? <TruncatedText text={job.contract_type} /> : null}
            {/* Date */}
            {date ? <DotSplitter /> : null}
            {date ? date.toLocaleDateString() : null}
            {/* Salary */}
            {job.salary && (job.salary.min || job.salary.max) ? <DotSplitter /> : null}
            {job.salary ? <Salary job={job} /> : null}
            {/* Interest Indicator */}
            <span className="ml-auto mr-0">
              <JobStatus job={job} />
            </span>
          </div>
          {/* Descripttion */}
          <div className="mt-4 text-gray-700 text-justify">
            {job.description}
          </div>
          <div className="pt-4 pb-2">
            {/* Technologies */}
            {job.technologies && job.technologies.length > 0 ? (
              <>
                {job.technologies.map((tech, index) => (
                  <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    #{tech}
                  </span>
                ))}
              </>
            ) : null}
            {/* Methodologies */}
            {job.methodologies && job.methodologies.length > 0 ? (
              <>
                {job.methodologies.map((method, index) => (
                  <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    #{method}
                  </span>
                ))}
              </>
            ) : null}
          </div>
          {/* Source url */}
          {job.source ? (
            <div className="grid grid-flow-col justify-items-end">
              <Link href={job.source} target="_blank" className="text-blue-500 hover:underline">
                {job.source ? new URL(job.source).hostname : "Lien non disponible"}
              </Link>
            </div>
          ) : <span className="text-gray-400">No source.</span>}
          {/* Mongo job id */}
          <div className="grid grid-flow-col justify-items-end">
            <span className="text-gray-400">{job._id && job._id.toString()}</span>
          </div>
        </div>
      </div>

      {/* Bouton LIKE droite */}
      <button
        onClick={() => onLike(job)}
        className="absolute right-0 flex flex-col items-center px-4 py-2 text-gray-500 hover:text-green-600 transition group"
        style={{ cursor: 'pointer' }}
      >
        <div className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center group-hover:border-green-400">
          <span className="text-2xl">♥</span>
        </div>
        <span className="text-sm mt-2">LIKE</span>
      </button>
    </div>
  );
}