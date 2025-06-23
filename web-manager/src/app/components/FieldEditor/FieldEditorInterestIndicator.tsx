'use client';

import { IJobEntity } from "@/types/IJobEntity";
import { useEffect, useRef, useState } from "react";
import BtnSave from "../Btn/BtnSave";
import { INTEREST_OPTIONS, INTEREST_OPTIONS_LEGEND } from "@/constants/job-interest-status";

interface FieldEditorInterestIndicatorProps {
  job: IJobEntity;
  isEditMode: boolean;
  saveFunction?: (value: string) => Promise<void>;
}

export default function FieldEditorInterestIndicator({ job, isEditMode, saveFunction }: FieldEditorInterestIndicatorProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [interest, setInterest] = useState<string>(job.interest_indicator || '[N/A]');
  const [isEditing, setIsEditing] = useState(false);

  // Mapping legend with option
  const getLegend = (value: string): string => {
    let legend: string = INTEREST_OPTIONS_LEGEND['[N/A]']

    for (const [key, legendValue] of Object.entries(INTEREST_OPTIONS_LEGEND)) {
      if (value === key) {
        legend = legendValue
        if (legendValue !== '[N/A]') {
          legend = `${key} ${legend}`
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

  const save = async () => {
    if (saveFunction && isEditMode) {
      try {
        await saveFunction(interest);
        setIsEditing(false);
      } catch (error) {
        let errorMessage = "An error occurred while saving the value.";
        if (error instanceof Error) errorMessage = error.message;
        else if (typeof error === "string") errorMessage = error;
        console.error(errorMessage);
      }
    } else {
      setIsEditing(false);
    }
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