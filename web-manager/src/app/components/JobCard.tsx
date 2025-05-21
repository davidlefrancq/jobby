'use client';

import Link from 'next/link';
import { IJobEntity } from '@/types/IJobEntity';
import AlertMessage from './AlertMessage';
import LanguageFlag from './LanguageFlag';
import TruncatedText from './TruncatedText';

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
    <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center min-h-[40vh] px-4">
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
      <div className="bg-white rounded-xl p-8 shadow-lg w-full max-w-xl text-center">
        <div className="text-left">
          {/* Job title and company */}
          <h2 className="text-xl font-bold">{job.title}</h2>
          <p className="text-gray-700 font-medium">{job.company}</p>
          {/* Details */}
          <p className="flex text-gray-500 text-sm">
            {job.language ? <LanguageFlag language={job.language} padding={"pr-2"} />: null}
            {job.location}
            {job.contract_type ? <DotSplitter /> : null}
            {job.contract_type ? <TruncatedText text={job.contract_type} /> : null}
            {date ? <DotSplitter /> : null}
            {date ? date.toLocaleDateString() : null}
            {job.salary && (job.salary.min || job.salary.max) ? <DotSplitter /> : null}
            {job.salary ? <Salary job={job} /> : null}
            <span className="ml-auto mr-0">
              {job.interest_indicator}
            </span>
          </p>
          {/* Descripttion */}
          <p className="mt-4 text-gray-700">
            {job.description}
          </p>
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
                Source
              </Link>
            </div>
          ) : <AlertMessage type='warning' message='Unknown source link.' /> }
          {/* Mongo job id */}
          <div className="grid grid-flow-col justify-items-end">
            <span className="text-gray-400">{job._id.toString()}</span>
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