'use client';

import { ChangeEvent, useEffect, useRef, useState } from "react";
import BtnSave from "../Btn/BtnSave";
import FieldEditorErrorPanel from "./FieldEditorErrorPanel";

interface FieldEditorTextareaProps {
  className?: string;
  initialValue: string | null | undefined;
  legendValue?: string;
  isEditMode: boolean;
  saveFunction?: (value: string) => void;
}

export default function FieldEditorTextarea({ className, initialValue, legendValue, isEditMode, saveFunction }: FieldEditorTextareaProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState<string | null | undefined>(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleremoveError = () => {
    setError(null);
  }

  const save = async () => {
    if (saveFunction && isEditMode && inputValue !== undefined) {
      try {
        await saveFunction(inputValue || '');
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

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setInputValue(e.target.value);
  };

  // Reset input value when initialValue changes
  useEffect(() => {
    setInputValue(initialValue || null);
  }, [initialValue]);

  // Handle Escape key and click outside to stop editing
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

  let style = "flex flex-wrap items-center gap-1 px-2 py-2";
  if (className) {
    style += ` ${className}`;
  }
  if (isEditMode && isEditing) style += " bg-blue-100 rounded shadow-md";
  
  if (isEditMode && isEditing) {
    return (
      <div ref={ref} className={style}>
        <div className="text-sm text-gray-600 w-full">
          <textarea
            rows={3}
            cols={50}
            value={inputValue || ''}
            onChange={(e) => handleChange(e)}
            className="flex-1 w-full px-2 py-1 mr-1 border rounded text-sm focus:outline-none h-24"
            placeholder={legendValue ? legendValue : "Description"}
          />
        </div>
        <BtnSave onClick={save} />
        <FieldEditorErrorPanel message={error} close={handleremoveError} />
      </div>
    );
  }

  if (isEditMode) style = "cursor-pointer hover:bg-blue-100";
  return (
    <div
      ref={ref}
      className={style}
      onClick={() => { if (isEditMode) setIsEditing(true); }}
    >
      <div className="text-sm text-gray-600 overflow-auto h-24">
        {inputValue || '[N/A]'}
      </div>
    </div>
  );
}