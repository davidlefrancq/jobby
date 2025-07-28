'use client';

import { useEffect, useRef, useState } from "react";
import FieldEditorErrorPanel from "./FieldEditorErrorPanel";
import { ICompanyDetails, IJobEntity } from "@/types/IJobEntity";
import BtnLoading from "../Btn/BtnLoading";
import { Save } from "lucide-react";
import { addAlert } from "@/app/store/alertsReducer";
import { useAppDispatch } from "@/app/store";

interface FieldEditorCompanySirenProps {
  job: IJobEntity;
  isEditMode: boolean;
  saveFunction?: (value: Partial<IJobEntity>) => Promise<void>;
}

export default function FieldEditorCompanySiren({ job, isEditMode, saveFunction }: FieldEditorCompanySirenProps) {
  const dispatch = useAppDispatch();

  const ref = useRef<HTMLDivElement>(null);

  const [inputSiren, setInputSiren] = useState<string | null>(job.company_details?.siren || null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inSaving, setInSaving] = useState(false);

  const handleRemoveError = () => {
    setError(null);
  };

  const handleSirenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          if (isNaN(value)) {
            setError("SIREN must be a number");
          } else {
            setInputSiren(value.toString());
            setError(null);
          }
        } else {
          setError("SIREN must be a number");
        }
      }
    } catch (error) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        type: 'error',
        message: `Failed to process SIREN input. Error: ${String(error)}`,
      }));
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
          
          // If inputSiren has changed, prepare to update it
          if (inputSiren && inputSiren !== job.company_details?.siren) {
            const companyDetails = job.company_details || {} as ICompanyDetails;
            companyDetails.siren = inputSiren;
            inputJob.company_details = companyDetails;
            inputJob._id = job._id;
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
    const originalStingified = JSON.stringify({ siren: job.company_details?.siren || null});
    const newStringified = JSON.stringify({ siren: inputSiren });
    if (originalStingified !== newStringified) result = true;
    return result
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
      <div ref={ref} className="flex items-center shadow-md rounded py-1 px-1">
        <input
          type="text"
          value={inputSiren || ''}
          onChange={handleSirenChange}
          className="border border-blue-800 rounded px-2 py-1 w-full mr-1"
          placeholder="SIREN"
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
  if (isEditMode) className += 'cursor-pointer hover:text-blue-700 dark:hover:text-blue-500';
  return (
    <span
      className={className}
      onClick={() => { if (isEditMode) setIsEditing(true); }}
    >
      {/* {inputSiren || '[N/A]'} */}
      {inputSiren && inputSiren }
      {!inputSiren && !isEditMode && <span className="text-gray-500 dark:text-neutral-400">[N/A]</span>}
      {/* {isEditMode && <span className="ml-1 text-blue-500 dark:text-blue-400 cursor-pointer">Edit Siren</span>} */}
      {isEditMode && (
        <button
          className={`
            px-2
            py-1
            bg-blue-600
            text-white
            rounded
            hover:bg-blue-700
          `}
          onClick={() => setIsEditing(true)}
        >
          Edit SIREN
        </button>
      )}
    </span>
  )
}
