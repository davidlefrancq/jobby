import { IJobEntity } from "@/types/IJobEntity";

interface JobTagsProps {
  job: IJobEntity;
}

export default function JobTags({ job }: JobTagsProps) {
  const technologies = job.technologies || [];
  const methodologies = job.methodologies || [];
  const tags = [...technologies, ...methodologies].sort((a, b) => a.localeCompare(b));

  const isTechnology = (tag: string) => {
    return technologies.includes(tag);
  };
  
  const cssTechnology = "bg-sky-100 text-sky-900 dark:bg-sky-900 dark:text-gray-100";
  const cssMethodology = "bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-gray-100";

  return (
    <div className="flex flex-wrap gap-2 mt-2 mb-2">
      {tags.map((tag, index) => (
        <span
          key={index}
          className={`px-3 py-1 rounded-full text-sm font-semibold ${isTechnology(tag) ? cssTechnology : cssMethodology}`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}