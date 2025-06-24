import { IExperience } from "@/types/ICvEntity";
import { useState } from "react";
import FieldEditorStringLight from "./FieldEditor/FieldEditorStringLight";
import FieldEditorBoolLight from "./FieldEditor/FieldEditorBoolLight";
import FieldEditorTextareaLight from "./FieldEditor/FieldEditorTextareaLight";
import FieldEditorDateLight from "./FieldEditor/FieldEditorDateLight";

interface CVFormEditExperienceProps {
  experience?: IExperience;
}

export default function CVFormEditExperience ({ experience }: CVFormEditExperienceProps) {
  const [title, setTitle] = useState(experience ? experience.title : '');
  const [company, setCompany] = useState(experience ? experience.company : '');
  const [location, setLocation] = useState(experience ? experience.location : '');
  const [dateStart, setDateStart] = useState<Date | null>(experience ? experience.dateStart : null);
  const [dateEnd, setDateEnd] = useState<Date | null>(experience ? experience.dateEnd : null);
  const [description, setDescription] = useState(experience ? experience.description : '');
  const [isAlternance, setIsAlternance] = useState(experience ? experience.isAlternance : false);

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
    </div>
  );
}