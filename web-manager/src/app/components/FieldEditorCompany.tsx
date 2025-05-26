'use client';

import { useEffect, useRef, useState } from "react";
import FieldEditorErrorPanel from "./FieldEditorErrorPanel";
import BtnSave from "./BtnSave";

interface FieldEditorCompanyProps {
  company: string | null | undefined;
  isEditMode: boolean;
  saveFunction?: (value: string | null) => Promise<void>;
}

export default function FieldEditorCompany({ company, isEditMode, saveFunction }: FieldEditorCompanyProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [inputCompany, setInputCompany] = useState<string | null | undefined>(company);
  const [siren, setSiren] = useState<string | null>(null);
  const [siret, setSiret] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  const handleremoveError = () => {
    setError(null);
  };

  const save = async () => {
    // TODO: Rework save logic
    console.log("Saving company:", inputCompany, "SIREN:", siren, "SIRET:", siret);

    // if (saveFunction) {
    //   try {
    //     await saveFunction(inputCompany || null);
    //     setIsEditing(false);
    //   } catch (error) {
    //     let errorMessage = "An error occurred while saving the value.";
    //     if (error instanceof Error) errorMessage = error.message;
    //     else if (typeof error === "string") errorMessage = error;
    //     setError(errorMessage);
    //   }
    // } else {
    //   setIsEditing(false);
    // }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputCompany(e.target.value);
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
      <div ref={ref} className="absolute flex items-center bg-blue-100 shadow-md rounded py-1 px-1">
        <input
          type="text"
          value={inputCompany || ''}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full mr-1"
          placeholder="Company name"
        />
        <input
          type="text"
          value={siren || ''}
          onChange={(e) => setSiren(e.target.value)}
          className="border rounded px-2 py-1 w-full mr-1"
          placeholder="SIREN (optional)"
        />
        <input
          type="text"
          value={siret || ''}
          onChange={(e) => setSiret(e.target.value)}
          className="border rounded px-2 py-1 w-full mr-1"
          placeholder="SIRET (optional)"
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
      {inputCompany || '[N/A]'}
    </span>
  )
}
