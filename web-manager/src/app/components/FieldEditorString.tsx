'use client';

import { useEffect, useRef, useState } from "react";
import FieldEditorErrorPanel from "./FieldEditorErrorPanel";

interface FieldEditorStringProps {
  initialValue: string | null | undefined;
  legendValue?: string;
  isEditMode: boolean;
  saveFunction?: (value: string | null) => Promise<void>;
}

export default function FieldEditorString({ initialValue, legendValue, isEditMode, saveFunction }: FieldEditorStringProps) {
  const ref = useRef<HTMLDivElement>(null);

    const [inputValue, setInputValue] = useState<string | null | undefined>(initialValue);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleremoveError = () => {
      setError(null);
    }

    const save = async () => {
      if (saveFunction) {
        try {
          await saveFunction(inputValue || null);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
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
          <input
            type="text"
            value={inputValue || ''}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full mr-1"
            placeholder={legendValue ? legendValue : "Enter value"}
          />
          <button onClick={save} className="bg-blue-500 text-white px-3 py-1 rounded">Save</button>         
          <FieldEditorErrorPanel message={error} close={handleremoveError} />
        </div>
      );
    }

    let className = '';
    if (isEditMode) className += 'cursor-pointer hover:text-blue-600';
    return (
      <div
        ref={ref}
        className={className}
        onClick={() => { if (isEditMode) setIsEditing(true); }}
      >
        {inputValue || '[N/A]'}
      </div>
    );
}