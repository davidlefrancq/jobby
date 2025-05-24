'user client';

import { IJobEntity } from "@/types/IJobEntity";
import { useEffect, useRef, useState } from "react";
import BtnSave from "./BtnSave";

interface FieldEditorDescriptionProps {
  job: IJobEntity;
  isEditMode: boolean;
}

export default function FieldEditorDescription({ job, isEditMode }: FieldEditorDescriptionProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [description, setDescription] = useState<string>(job.description || '');
  const [isEditing, setIsEditing] = useState(false);

  const save = () => {}

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
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
    };
  }, []);

  if (isEditMode && isEditing) {
    return (
      <div ref={ref} className="flex items-center bg-blue-100 shadow-md rounded py-1 px-1">
        <textarea
          value={description}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full resize-y min-h-[100px] mr-1"
          placeholder="Description du poste"
        />
        <BtnSave onClick={save} />
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
      {description || "[ NC ]"}
    </span>
  );
}
