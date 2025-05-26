'use client';

import { IJobEntity } from "@/types/IJobEntity";
import { ReactElement, useEffect, useRef, useState } from "react";
import BtnSave from "./BtnSave";
import StatusDot from "./StatusDot";
import { INTEREST_OPTIONS, INTEREST_OPTIONS_LEGEND } from "@/constants/job-interest-status";

const INTEREST_STATUS: Record<string, ReactElement> = {
  '✅': <StatusDot status="success" />,
  '🟢': <StatusDot status="success" />,
  '🟡': <StatusDot status="warning" />,
  '🔴': <StatusDot status="error" />,
}

interface FieldEditorInterestIndicatorProps {
  job: IJobEntity;
  isEditMode: boolean;
}

export default function FieldEditorInterestIndicator({ job, isEditMode }: FieldEditorInterestIndicatorProps) {
  const ref = useRef<HTMLDivElement>(null);

  const interestInitialValue = INTEREST_OPTIONS.includes(job.interest_indicator || '') ? job.interest_indicator : '[N/A]';
  const [interest, setInterest] = useState<string>(interestInitialValue);
  const [isEditing, setIsEditing] = useState(false);

  // Mapping legend with option
  const getLegend = (value: string) => {
    let legend: ReactElement = <>{INTEREST_OPTIONS_LEGEND['[N/A]']}</>

    for (const [key, legendValue] of Object.entries(INTEREST_OPTIONS_LEGEND)) {
      if (value === key) {
        legend = <>{legendValue}</>
        if (legendValue !== '[N/A]') {
          legend = (
            <span className="flex items-center gap-1">
              {INTEREST_STATUS[key]}
              {legend}
            </span>
          );
        }
        break;
      }
    }

    return legend;
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && !interest.includes(value)) {
      setInterest(value);
    }
  };

  const save = () => {
    console.log('Save interests:', interest);
    setIsEditing(false);
  };

  // Handle keydown and click outside to close editor
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEditing(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  // Form editor for interest indicator
  if (isEditMode && isEditing) {
    return (
      <div ref={ref} className="flex items-center bg-blue-100 shadow-md rounded py-1 px-1">
        {/* List choice */}
        <select
          value={interest}
          onChange={handleChange}
          className="border rounded px-2 py-1 mr-1"
        >
          <option value="" disabled>Select interest</option>
          {INTEREST_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option && getLegend(option)}
            </option>
          ))}
        </select>
        <BtnSave onClick={save} />
      </div>
    );
  }

  // Display interest indicator
  let className = '';
  if (isEditMode) className = 'cursor-pointer hover:text-blue-600';
  return (
    <span
      className={className}
      onClick={() => { if (isEditMode) setIsEditing(true); }}
    >
      {interest && getLegend(interest) ? getLegend(interest) : '[N/A]'}
    </span>
  );
}