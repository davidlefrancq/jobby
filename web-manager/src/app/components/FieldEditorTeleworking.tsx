'use client';

import { useEffect, useRef, useState } from "react";
import { IJobEntity } from "@/types/IJobEntity";
import Toggle from "./Toggle";
import FieldEditorErrorPanel from "./FieldEditorErrorPanel";

interface FieldEditorTeleworkingProps {
  job: IJobEntity;
  isEditMode: boolean;
  saveFunction?: (value: boolean) => Promise<void>;
}

export default function FieldEditorTeleworking ({ job, isEditMode, saveFunction }: FieldEditorTeleworkingProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [teleworking, setTeleworking] = useState(job.teleworking || false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleremoveError = () => {
    setError(null);
  }

  const save = async () => {
    if (saveFunction) {
      try {
        await saveFunction(teleworking);
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
    save();
  }, [teleworking]);

  // Form editor for teleworking
  if (isEditMode) {
    return (
      <div ref={ref} className="flex items-center bg-blue-100 shadow-md rounded py-1 px-1">
        <Toggle checked={teleworking} onChange={(value: boolean) => {
          if (isEditing) setTeleworking(value);
        }} />
        <FieldEditorErrorPanel message={error} close={handleremoveError} />
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