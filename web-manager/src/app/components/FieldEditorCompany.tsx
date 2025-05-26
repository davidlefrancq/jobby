'use client';

import { useEffect, useRef, useState } from "react";
import FieldEditorErrorPanel from "./FieldEditorErrorPanel";
import BtnSave from "./BtnSave";
import { IJobEntity } from "@/types/IJobEntity";

interface FieldEditorCompanyProps {
  job: IJobEntity;
  isEditMode: boolean;
  saveFunction?: (value: Partial<IJobEntity>) => Promise<void>;
}

export default function FieldEditorCompany({ job, isEditMode, saveFunction }: FieldEditorCompanyProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [inputCompany, setInputCompany] = useState<string | null>(job.company || null);
  const [inputSiren, setInputSiren] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  const handleremoveError = () => {
    setError(null);
  };

  const handleSirenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("SIREN change:", e.target.value);
    try {
      if (!e.target.value) {
        setInputSiren(null);
      } else {
        // Check integer value
        if (/^\d+$/.test(e.target.value.trim())) {
          const value = parseInt(e.target.value.trim());
          console.log("Parsed SIREN value:", value);
          if (isNaN(value)) {
            console.error("SIREN is not a number:", e.target.value);
            setError("SIREN must be a number");
          } else {
            setInputSiren(value.toString());
            setError(null);
          }
        } else {
          console.error("SIREN is not a valid number:", e.target.value);
          setError("SIREN must be a number");
        }
      }
    } catch (error) {
      console.error(error);
      setError("SIREN must be a number.");
    }    
  }

  const isValidSiren = (siren: string | null): boolean => {
    let result = true;

    const sirenRegex = /^[0-9]{9}$/;
    if (siren && !sirenRegex.test(siren)) {
      result = false;
    }

    return result;
  }

  const save = async () => {
    console.log("Saving company:", inputCompany, "SIREN:", inputSiren);

    if (saveFunction && isChanged()) {
      // TODO: Rework save logic

      if (!isValidSiren(inputSiren)) {
        setError("SIREN must be a 9-digit number.");
      }

      //   try {
      //     await saveFunction(inputCompany || null);
      //     setIsEditing(false);
      //   } catch (error) {
      //     let errorMessage = "An error occurred while saving the value.";
      //     if (error instanceof Error) errorMessage = error.message;
      //     else if (typeof error === "string") errorMessage = error;
      //     setError(errorMessage);
      //   }
    } else {
      setIsEditing(false);
    }
  };

  const isChanged = (): boolean => {
    let result = false;
    const originalStingified = JSON.stringify({ company: job.company, siren: job.company_details?.siren || null});
    const newStringified = JSON.stringify({ company: inputCompany, siren: inputSiren });
    if (originalStingified !== newStringified) result = true;
    return result
  }


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
          value={inputSiren || ''}
          onChange={handleSirenChange}
          className="border rounded px-2 py-1 w-full mr-1"
          placeholder="SIREN (optional)"
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
