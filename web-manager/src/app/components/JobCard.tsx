'use client';

import { IJobEntity } from '@/types/IJobEntity';

interface JobCardProps {
  job: IJobEntity;
  onClick: (job: IJobEntity) => void;
}

export default function JobCard({ job, onClick }: JobCardProps) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 hover:shadow-xl transition" onClick={() => onClick(job)}>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h2>
      <p className="text-gray-600 text-sm mb-1">
        <span className="font-medium">Entreprise :</span> {job.company}
      </p>
      <p className="text-gray-600 text-sm mb-3">
        <span className="font-medium">Localisation :</span> {job.location}
      </p>
      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
        {job.description?.slice(0, 100) ?? ''}...
      </p>
    </div>
  );
}