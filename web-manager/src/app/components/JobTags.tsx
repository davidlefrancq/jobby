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
  
  const cssTechnology = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
  const cssMethodology = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((tag, index) => (
        <span
          key={index}
          className={`px-3 py-1 rounded-full text-xs font-semibold ${isTechnology(tag) ? cssTechnology : cssMethodology}`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}