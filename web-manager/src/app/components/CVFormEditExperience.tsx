import { IExperience } from "@/types/ICvEntity";
import { useEffect, useState } from "react";
import FieldEditorStringLight from "./FieldEditor/FieldEditorStringLight";
import FieldEditorBoolLight from "./FieldEditor/FieldEditorBoolLight";
import FieldEditorTextareaLight from "./FieldEditor/FieldEditorTextareaLight";
import FieldEditorDateLight from "./FieldEditor/FieldEditorDateLight";
import { useAppDispatch } from "../store";
import { addAlert } from "../store/alertsReducer";

export interface IExperienceSaveFunctionParams {
  experience: IExperience;
  initialValue?: IExperience;
}

interface CVFormEditExperienceProps {
  experience?: IExperience;
  saveFunction?: (params: IExperienceSaveFunctionParams) => void;
}

export default function CVFormEditExperience ({ experience, saveFunction }: CVFormEditExperienceProps) {
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState(experience ? experience.title : '');
  const [company, setCompany] = useState(experience ? experience.company : '');
  const [location, setLocation] = useState(experience ? experience.location : '');
  const [dateStart, setDateStart] = useState<Date | null>(experience ? experience.dateStart : null);
  const [dateEnd, setDateEnd] = useState<Date | null>(experience ? experience.dateEnd : null);
  const [description, setDescription] = useState(experience ? experience.description : '');
  const [isAlternance, setIsAlternance] = useState(experience ? experience.isAlternance : false);

  const fromReset = () => {
    setTitle('');
    setCompany('');
    setLocation('');
    setDateStart(null);
    setDateEnd(null);
    setDescription('');
    setIsAlternance(false);
  };

  const handleSave = () => {
    if (typeof saveFunction === 'function') {
      try {
        const newExperience: IExperience = {
          title,
          company,
          location,
          dateStart,
          dateEnd,
          description,
          isAlternance
        };
        saveFunction({ experience: newExperience, initialValue: experience });
        fromReset();
      } catch (error) {
        dispatch(addAlert({
          date: new Date().toISOString(),
          type: 'error',
          message: `Saving experience has failed: ${String(error)}`,
        }));
      }
    }
  };

  useEffect(() => {
    // Reset form when experience prop changes
    if (experience) {
      setTitle(experience.title);
      setCompany(experience.company);
      setLocation(experience.location);
      setDateStart(experience.dateStart);
      setDateEnd(experience.dateEnd);
      setDescription(experience.description);
      setIsAlternance(experience.isAlternance);
    }
  }, [experience]);

  return (
    <div>
      {/* Expereince title */}
      <FieldEditorStringLight className="mt-1" initialValue={title} saveFunction={(value) => setTitle(value)} legendValue="Titre" />

      {/* Company */}
      <FieldEditorStringLight className="mt-1" initialValue={company} saveFunction={(value) => setCompany(value)} legendValue="Entreprise" />

      {/* Location */}
      <FieldEditorStringLight className="mt-1" initialValue={location} saveFunction={(value) => setLocation(value)} legendValue="Lieu" />

      {/* Date Start */}
      <FieldEditorDateLight className="mt-1" initialValue={dateStart} saveFunction={(value) => setDateStart(value)} legendValue="Date de début" />

      {/* Date End */}
      <FieldEditorDateLight className="mt-1" initialValue={dateEnd} saveFunction={(value) => setDateEnd(value)} legendValue="Date de fin" />

      {/* Description */}
      <FieldEditorTextareaLight className="mt-1" initialValue={description} saveFunction={(value) => setDescription(value)} />

      {/* Is Alternance */}
      <FieldEditorBoolLight className="mt-1" initialValue={isAlternance} saveFunction={(value) => setIsAlternance(value)} legendValue="Alternance" />


      {/* Actions menu */}
      <div className="flex items-end bg-blue-50 px-2 py-2 max-w-xl border-t-1 border-gray-400 mt-4">
        <div className="flex-1"></div>
        {/* Add button */}
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}