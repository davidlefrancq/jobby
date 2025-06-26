'user client';

import { IJobEntity } from "@/types/IJobEntity";
import { useEffect, useRef, useState } from "react";
import BtnSave from "../Btn/BtnSave";
import FieldEditorErrorPanel from "./FieldEditorErrorPanel";

interface FieldEditorDescriptionProps {
  job: IJobEntity;
  isEditMode: boolean;
  saveAction?: (value: string | null) => Promise<void>;
}

export default function FieldEditorDescription({ job, isEditMode, saveAction }: FieldEditorDescriptionProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [description, setDescription] = useState<string | null>(job.description || null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (saveAction) {
      try {
        await saveAction(description || null);
        setIsEditing(false);
      } catch (error) {
        let errorMessage = "An error occurred while saving the description.";
        if (error instanceof Error) errorMessage = error.message;
        else if (typeof error === "string") errorMessage = error;
        setError(errorMessage);
      }
    } else {
      setIsEditing(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleremoveError = () => {
    setError(null);
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
        <textarea
          value={description || ''}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full resize-y min-h-[100px] mr-1"
          placeholder="Description of the job"
        />
        <BtnSave onClick={save} />
        <FieldEditorErrorPanel message={error} close={handleremoveError} />
      </div>
    );
  }

  let className = '';
  if (isEditMode) className += 'cursor-pointer hover:text-blue-600';
  return (
    <span
      className={className}
      onClick={() => { if (isEditMode) setIsEditing(true); }}
    >
      {description || '[N/A]'}
    </span>
  );
}
