'use client';

import { IJobEntity, ISalary } from "@/types/IJobEntity";
import { useEffect, useRef, useState } from "react";
import BtnSave from "./BtnSave";
import FieldEditorErrorPanel from "./FieldEditorErrorPanel";

interface FieldEditorSalaryProps {
  job: IJobEntity;
  isEditMode: boolean;
  saveFunction?: (value: ISalary) => Promise<void>;
}

export default function FieldEditorSalary({ job, isEditMode, saveFunction }: FieldEditorSalaryProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [minSalary, setMinSalary] = useState<number>(job.salary?.min || 0);
  const [maxSalary, setMaxSalary] = useState<number>(job.salary?.max || 0);
  const [currency, setCurrency] = useState<string | null>(job.salary?.currency || null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleremoveError = () => {
    setError(null);
  }

  const save = async () => {
    const value: ISalary = {
      min: minSalary,
      max: maxSalary,
      currency: currency || '',
    }

    if (saveFunction && isEditMode && isChanged()) {
      try {
        await saveFunction(value);
        setIsEditing(false);
      } catch (error) {
        let errorMessage = "An error occurred while saving the value.";
        if (error instanceof Error) errorMessage = error.message;
        else if (typeof error === "string") errorMessage = error;
        setError(errorMessage);
      }
    } else {
      setIsEditing(false);
    }
  };

  const isChanged = (): boolean => {
    let result = false;
    const value: ISalary = {
      min: minSalary,
      max: maxSalary,
      currency: currency || '',
    }
    const originalStingified = JSON.stringify(job.salary || []);
    const newStringified = JSON.stringify(value);
    if (originalStingified !== newStringified) result = true;
    return result
  }

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
    };
  }, []);

  if (isEditMode && isEditing) {
    return (
      <div ref={ref} className="flex items-center bg-blue-100 shadow-md rounded py-1 px-1">
        <input
          type="number"
          value={minSalary}
          onChange={(e) => setMinSalary(Number(e.target.value))}
          className="border rounded px-2 py-1 w-28"
          placeholder="Min"
        />
        <span className="text-gray-500 ml-1 mr-1">-</span>
        <input
          type="number"
          value={maxSalary}
          onChange={(e) => setMaxSalary(Number(e.target.value))}
          className="border rounded px-2 py-1 w-28"
          placeholder="Max"
        />
        <input
          type="text"
          value={currency || ''}
          onChange={(e) => setCurrency(e.target.value)}
          className="border rounded ml-1 mr-1 px-2 py-1 w-14"
          placeholder="Devise"
        />
        <BtnSave onClick={save} />
        <FieldEditorErrorPanel message={error} close={handleremoveError} />
      </div>
    );
  }

  let className = '';
  if (isEditMode) className = 'cursor-pointer hover:text-blue-600';
  return (
    <span
      className={className}
      onClick={() => { if (isEditMode) setIsEditing(true); }}
    >
      {minSalary !== null && maxSalary !== null
        ? `${minSalary} - ${maxSalary} ${currency || ''}`
        : '[N/A]'}
    </span>
  );
}