'use client';

import { IJobEntity } from "@/types/IJobEntity";
import { useEffect, useRef, useState } from "react";
import BtnSave from "./BtnSave";

interface FieldEditorTechnologiesProps {
  job: IJobEntity;
  isEditMode: boolean;
}

export default function FieldEditorTechnologies({ job, isEditMode }: FieldEditorTechnologiesProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [techList, setTechList] = useState<string[]>(job.technologies || []);
  const [isEditing, setIsEditing] = useState(isEditMode);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      setTechList(value.split(',').map(tech => tech.trim()));
    } else {
      setTechList([]);
    }
  };

  const save = () => {
    // TODO: Implement the save logic here, e.g., send the techList to the server or update the job entity
    console.log('Saved technologies:', techList);
    setIsEditing(false);
  };

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
          value={techList.join(', ')}
          onChange={handleChange}
          className="border rounded px-2 py-1 mr-1"
          placeholder="tech1, tech2, tech3"
        />
        <BtnSave onClick={save} />
      </div>
    );
  }

  let className = '';
  if (isEditMode) className = 'cursor-pointer hover:text-blue-600';
  return (
    <div className="flex items-center">
      <span
        className={className}
        onClick={() => { if (isEditMode) setIsEditing(true); }}
      >
        {techList.join(', ') || "[ NC ]"}
      </span>
    </div>
  )
}