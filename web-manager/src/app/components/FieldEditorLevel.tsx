'use client';

import { IJobEntity } from "@/types/IJobEntity";
import { useEffect, useRef, useState } from "react";
import BtnSave from "./BtnSave";

interface FieldEditorLevelProps {
  job: IJobEntity;
  isEditMode: boolean;
}

export default function FieldEditorLevel({ job, isEditMode }: FieldEditorLevelProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [jobLevel, setJobLevel] = useState<string | null>(job.level || null);
  const [isEditing, setIsEditing] = useState(false);

  // job.level is a string or null. It's a level of the job. It can be 'junior', 'mid', 'senior' or null.
  const levels = ['junior', 'intermédiaire', 'senior']; // this is a proposition list but not exhaustive

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedLevel = e.target.value;
    setJobLevel(selectedLevel);
  }

  const save = () => {
    console.log('Save level:', jobLevel);
    setIsEditing(false);
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
        />
        <datalist id="levels">
          {levels.map((level) => (
            <option key={level} value={level} />
          ))}
        </datalist>
        <BtnSave onClick={save} />
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
      {jobLevel || "[ NC ]"}
    </span>
  );
}