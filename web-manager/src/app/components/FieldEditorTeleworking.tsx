'use client';

import { useEffect, useRef, useState } from "react";
import { IJobEntity } from "@/types/IJobEntity";
import Toggle from "./Toggle";

interface FieldEditorTeleworkingProps {
  job: IJobEntity;
  isEditMode: boolean;
}

export default function FieldEditorTeleworking ({ job, isEditMode }: FieldEditorTeleworkingProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [teleworking, setTeleworking] = useState(job.teleworking || false);
  const [isEditing, setIsEditing] = useState(false);

  const save = () => {
    // TODO: call repository to save this field
    console.log('Save salary:', { teleworking });
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
    };
  }, []);

  // Save when toggle switch
  useEffect(() => {
    if (job.teleworking !== teleworking) {
      save();
    }
  }, [teleworking]);

  // Form editor for teleworking
  if (isEditMode && isEditing) {
    return (
      <div ref={ref} className="flex items-center bg-blue-100 shadow-md rounded py-1 px-1">
        <Toggle checked={teleworking} onChange={setTeleworking} />
      </div>
    );
  }

  // Display teleworking
  let className = ''
  if (isEditMode) className = 'cursor-pointer hover:text-blue-600';
  return (
    <span
      className={className}
      onClick={() => { if (isEditMode) setIsEditing(true); }}
    >
      {teleworking ? 'Oui' : 'Non'}
    </span>
  )
}