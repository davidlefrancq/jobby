'use client';

import { useEffect, useRef, useState } from "react";
import FieldEditorErrorPanel from "./FieldEditorErrorPanel";
import { ICompanyDetails, IJobEntity } from "@/types/IJobEntity";
import BtnLoading from "./BtnLoading";
import { Save } from "lucide-react";

interface FieldEditorCompanyProps {
  job: IJobEntity;
  isEditMode: boolean;
  saveFunction?: (value: Partial<IJobEntity>) => Promise<void>;
}

export default function FieldEditorCompany({ job, isEditMode, saveFunction }: FieldEditorCompanyProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [inputCompany, setInputCompany] = useState<string | null>(job.company || null);
  const [inputSiren, setInputSiren] = useState<string | null>(job.company_details?.siren || null);
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [inSaving, setInSaving] = useState(false);

  const handleRemoveError = () => {
    setError(null);
  };

  const handleSirenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("SIREN change:", e.target.value);
    try {
      if (!e.target.value) {
        setInputSiren(null);
      } else {
        let sirenValue = e.target.value.trim();
        // Remove spaces and dashes
        sirenValue = sirenValue.replace(/[\s-]/g, "");

        // Check integer value
        if (/^\d+$/.test(sirenValue)) {
          const value = parseInt(sirenValue);
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
    if (!inSaving && saveFunction && isChanged()) {
      setInSaving(true);

      // Validate inputs
      if (!isValidSiren(inputSiren)) {
        setError("SIREN must be a 9-digit number.");
        setInSaving(false);
      }
      else {
        try {
          const inputJob: Partial<IJobEntity> = {}

          // If inputCompany has changed, prepare update it
          if (inputCompany && inputCompany !== job.company) inputJob.company = inputCompany;
          
          // If inputSiren has changed, prepare to update it
          if (inputSiren && inputSiren !== job.company_details?.siren) {
            const companyDetails = job.company_details || {} as ICompanyDetails;
            companyDetails.siren = inputSiren;
            inputJob.company_details = companyDetails;
          }

          // Save job company data
          await saveFunction(inputJob);
          setIsEditing(false);
        } catch (error) {
          let errorMessage = "An error occurred while saving the value.";
          if (error instanceof Error) errorMessage = error.message;
          else if (typeof error === "string") errorMessage = error;
          setError(errorMessage);
        } finally {
          setInSaving(false);
        }
      }
    } else {
      setInSaving(false);
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


  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          onChange={handleCompanyChange}
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
        <BtnLoading
          loading={inSaving}
          onClick={save}
          title={<Save className="w-4 h-4" />}
          width={"80px"}
          height={"28px"}
          rounded='rounded-xl'
        />
        <FieldEditorErrorPanel message={error} close={handleRemoveError} />
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
