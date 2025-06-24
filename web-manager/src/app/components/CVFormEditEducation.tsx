import { IEducation } from "@/types/ICvEntity";
import { useState } from "react";
import FieldEditorStringLight from "./FieldEditor/FieldEditorStringLight";
import FieldEditorTextareaLight from "./FieldEditor/FieldEditorTextareaLight";
import FieldEditorDateLight from "./FieldEditor/FieldEditorDateLight";

interface CVFormEditEducationProps {
  education?: IEducation;
}

export default function CVFormEditEducation ({ education }: CVFormEditEducationProps) {
  const [title, setTitle] = useState(education ? education.title : '');
  const [institution, setInstitution] = useState(education ? education.institution : '');
  const [location, setLocation] = useState(education ? education.location : '');
  const [dateStart, setDateStart] = useState<Date | null>(education ? education.dateStart : null);
  const [dateEnd, setDateEnd] = useState<Date | null>(education ? education.dateEnd : null);
  const [description, setDescription] = useState(education ? education.description : '');


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
    </div>
  );
}