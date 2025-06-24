import { useState } from "react";
import { ICvEntity } from "@/types/ICvEntity";
import { RepositoryFactory } from "../dal/RepositoryFactory";
import { useAppDispatch, useAppSelector } from "../store";
import { addAlert } from "../store/alertsReducer";
import { setCvs, setCvsCounter } from "../store/cvsReducer";
import FieldEditorStringArrayLight from "./FieldEditor/FieldEditorStringArrayLight";
import FieldEditorStringLight from "./FieldEditor/FieldEditorStringLight";
import FieldEditorBoolLight from "./FieldEditor/FieldEditorBoolLight";

const cvRepository = RepositoryFactory.getInstance().getCvRepository();

interface ICvFormNewProps {
  onClose: () => void;
}

export default function CVFormNew({ onClose }: ICvFormNewProps) {
  const dispatch = useAppDispatch()
  const { cvs } = useAppSelector(state => state.cvsReducer)

  // Flat fields for the form
  const [title, setTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [website, setWebsite] = useState('');
  const [drivingLicense, setDrivingLicense] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);


  const handleResset = () => {
    setTitle('');
    setFirstName('');
    setLastName('');
    setBirthDate(null);
    setCity('');
    setCountry('');
    setEmail('');
    setPhone('');
    setLinkedin('');
    setGithub('');
    setWebsite('');
    setDrivingLicense(false);
    setSkills([]);
    setInterests([]);
  };

  const handleSubmit = async () => {
    try {
      const newCv: Partial<ICvEntity> = {
        title,
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        city,
        country,
        email,
        phone,
        linkedin,
        github,
        website,
        driving_license: drivingLicense,
        skills,
        interests,
      }
      const created = await cvRepository.create(newCv);
      if (created) {
        const newCvList: ICvEntity[] = [...cvs.filter(cv => cv._id !== created._id), created]; 
        dispatch(setCvs(newCvList));
        dispatch(setCvsCounter(newCvList.length));
        onClose();
      }
    } catch (error) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: (error as Error).message,
        type: "error",
      }));
    }
  };

  return (
    <div className="p-4 border rounded mb-4">
      <h3 className="text-lg font-bold mb-2">Nouveau CV</h3>

      {/* CV Title */}
      <FieldEditorStringLight className="mt-1" initialValue={title} saveFunction={(value) => setTitle(value)} legendValue="Titre du CV" />

      {/* First name */}
      <FieldEditorStringLight className="mt-1" initialValue={firstName} saveFunction={(value) => setFirstName(value)} legendValue="Prénom" />

      {/* Last name */}
      <FieldEditorStringLight className="mt-1" initialValue={lastName} saveFunction={(value) => setLastName(value)} legendValue="Nom" />

      {/* Email */}
      <FieldEditorStringLight className="mt-1" initialValue={email} saveFunction={(value) => setEmail(value)} legendValue="Email" />
      
      {/* City */}
      <FieldEditorStringLight className="mt-1" initialValue={city} saveFunction={(value) => setCity(value)} legendValue="Ville" />
      
      {/* Country */}
      <FieldEditorStringLight className="mt-1" initialValue={country} saveFunction={(value) => setCountry(value)} legendValue="Pays" />
      
      {/* Driving License Checkbox */}
      <FieldEditorBoolLight className="mt-1" initialValue={drivingLicense} saveFunction={(value) => setDrivingLicense(value)} legendValue="Permis de conduire" />

      {/* Linkedin */}
      <FieldEditorStringLight className="mt-1" initialValue={linkedin}  saveFunction={(value) => setLinkedin(value)} legendValue="LinkedIn" />

      {/* Github */}
      <FieldEditorStringLight className="mt-1" initialValue={github}  saveFunction={(value) => setGithub(value)} legendValue="GitHub" />

      {/* Website */}
      <FieldEditorStringLight className="mt-1" initialValue={website}  saveFunction={(value) => setWebsite(value)} legendValue="Site web" />

      {/** Skills */}
      <FieldEditorStringArrayLight className={"mt-1"} items={skills} saveFunction={(value) => setSkills(value)} legendValue={"Compétences"} />

      {/* Interests */}
      <FieldEditorStringArrayLight className={"mt-1"} items={interests} saveFunction={(value) => setInterests(value)} legendValue={""} />

      {/* Submit button */}
      <button type="button" onClick={handleSubmit} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Enregistrer
      </button>

      {/* Reset Button */}
      <button type="reset" onClick={handleResset} className="ml-2 mt-4 px-4 py-2 bg-gray-300 text-black rounded">
        Réinitialiser
      </button>

      {/* Cancel button */}
      <button type="button" onClick={onClose} className="ml-2 mt-4 px-4 py-2 bg-red-500 text-white rounded">
        Annuler
      </button>
    </div>
  );
}
