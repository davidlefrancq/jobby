'use client';

import { ISalary } from "@/types/IJobEntity";

interface SalaryItemProps {
  title?: string;
  salary: ISalary;
}

export default function SalaryItem({ salary, title }: SalaryItemProps) {
  if (!salary) return null;
  const { min, max, currency } = salary;

  const separator = (salary: ISalary) => {
    if (salary.min === null) return null;
    if (salary.min === undefined) return null;
    if (salary.max === null) return null;
    if (salary.max === undefined) return null;
    return <span className="ml-1 mr-1">-</span>;
  }

  return (
    <div className="flex flex-col">
      {title ? <span className="text-sm text-gray-500">{ title }</span> : null}
      <div className="flex items-center">
        {min && (
          <span className="text-sm font-semibold">{min.toLocaleString()} {currency ? currency : ''}</span>
        )}
        {separator(salary)}
        {max && (
          <span className="text-sm font-semibold">{max.toLocaleString()} {currency ? currency : ''}</span>
        )}
      </div>
    </div>
  );
}