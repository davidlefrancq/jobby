'use client';

import { IJobEntity } from "@/types/IJobEntity";
import { useEffect, useRef, useState } from "react";
import BtnSave from "../Btn/BtnSave";
import FieldEditorErrorPanel from "./FieldEditorErrorPanel";

interface FieldEditorLevelProps {
  job: IJobEntity;
  isEditMode: boolean;
  saveFunction?: (value: string | null) => Promise<void>;
}

export default function FieldEditorLevel({ job, isEditMode, saveFunction }: FieldEditorLevelProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [jobLevel, setJobLevel] = useState<string | null>(job.level || null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // job.level is a string or null. It's a level of the job. It can be 'junior', 'mid', 'senior' or null.
  const levels = ['junior', 'intermédiaire', 'senior']; // this is a proposition list but not exhaustive

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedLevel = e.target.value;
    setJobLevel(selectedLevel);
  }

  const handleremoveError = () => {
    setError(null);
  }

  const save = async () => {
    if (saveFunction && isEditMode) {
      try {
        await saveFunction(jobLevel || null);
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
    }
  }, []);

  if (isEditMode && isEditing) {
    return (
      <div ref={ref} className="flex items-center bg-blue-100 shadow-md rounded py-1 px-1">
        <input
          type="text"
          value={jobLevel ? jobLevel : ''}
          onChange={(e) => handleChange(e)}
          className="border rounded px-2 py-1 mr-1"
          list="levels"
          placeholder="Job level (junior, senior, etc.)"
        />
        <datalist id="levels">
          {levels.map((level) => (
            <option key={level} value={level} />
          ))}
        </datalist>
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
      {jobLevel || '[N/A]'}
    </span>
  );
}