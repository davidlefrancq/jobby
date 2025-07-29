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
  
  const cssTechnology = "bg-violet-100 text-violet-900 dark:bg-violet-900 dark:text-gray-100";
  const cssMethodology = "bg-cyan-100 text-cyan-900 dark:bg-cyan-900 dark:text-gray-100";

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