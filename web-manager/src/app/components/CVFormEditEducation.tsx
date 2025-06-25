import { IEducation } from "@/types/ICvEntity";
import { useEffect, useState } from "react";
import FieldEditorStringLight from "./FieldEditor/FieldEditorStringLight";
import FieldEditorTextareaLight from "./FieldEditor/FieldEditorTextareaLight";
import FieldEditorDateLight from "./FieldEditor/FieldEditorDateLight";
import { useAppDispatch } from "../store";
import { addAlert } from "../store/alertsReducer";

export interface IEducationSaveFunctionParams {
  education: IEducation;
  initialValue?: IEducation;
}

interface CVFormEditEducationProps {
  education?: IEducation;
  saveFunction?: (params: IEducationSaveFunctionParams) => void;
}

export default function CVFormEditEducation ({ education, saveFunction }: CVFormEditEducationProps) {
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState(education ? education.title : '');
  const [institution, setInstitution] = useState(education ? education.institution : '');
  const [location, setLocation] = useState(education ? education.location : '');
  const [dateStart, setDateStart] = useState<Date | null>(education ? education.dateStart : null);
  const [dateEnd, setDateEnd] = useState<Date | null>(education ? education.dateEnd : null);
  const [description, setDescription] = useState(education ? education.description : '');

  const fromReset = () => {
    setTitle('');
    setInstitution('');
    setLocation('');
    setDateStart(null);
    setDateEnd(null);
    setDescription('');
  };

  const handleSave = () => {
    if (typeof saveFunction === 'function') {
      try {
        const newEducation: IEducation = {
          title,
          institution,
          location,
          dateStart,
          dateEnd,
          description
        };
        saveFunction({ education: newEducation, initialValue: education });
        fromReset();
      } catch (error) {
        dispatch(addAlert({
          date: new Date().toISOString(),
          type: 'error',
          message: `Saving education has failed: ${String(error)}`,
        }));
      }
    }
  };

  useEffect(() => {
    // Reset form when education prop changes
    if (education) {
      setTitle(education.title);
      setInstitution(education.institution);
      setLocation(education.location);
      setDateStart(education.dateStart || null);
      setDateEnd(education.dateEnd || null);
      setDescription(education.description);
    }
  }, [education]);

  return (
    <div>
      {/* Expereince title */}
      <FieldEditorStringLight className="mt-1" initialValue={title} saveFunction={(value) => setTitle(value)} legendValue="Titre" />

      {/* Institution */}
      <FieldEditorStringLight className="mt-1" initialValue={institution} saveFunction={(value) => setInstitution(value)} legendValue="Etablissement/Centre de formation" />

      {/* Location */}
      <FieldEditorStringLight className="mt-1" initialValue={location} saveFunction={(value) => setLocation(value)} legendValue="Lieu" />

      {/* Date Start */}
      <FieldEditorDateLight className="mt-1" initialValue={dateStart} saveFunction={(value) => setDateStart(value)} legendValue="Date de début" />

      {/* Date End */}
      <FieldEditorDateLight className="mt-1" initialValue={dateEnd} saveFunction={(value) => setDateEnd(value)} legendValue="Date de fin" />

      {/* Description */}
      <FieldEditorTextareaLight className="mt-1" initialValue={description} saveFunction={(value) => setDescription(value)} />

      {/* Actions menu */}
      <div className="flex items-end px-2 py-2 max-w-xl">
        <div className="flex-1"></div>
        {/* Add button */}
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
          onClick={handleSave}
        >
          +
        </button>
      </div>
    </div>
  );
}