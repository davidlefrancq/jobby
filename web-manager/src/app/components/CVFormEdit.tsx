import { useState } from "react";
import { ICvEntity } from "@/types/ICvEntity";
import { RepositoryFactory } from "../dal/RepositoryFactory";
import { useAppDispatch, useAppSelector } from "../store";
import { addAlert } from "../store/alertsReducer";
import { setCvs, setCvsCounter } from "../store/cvsReducer";
import FieldEditorStringArrayLight from "./FieldEditor/FieldEditorStringArrayLight";
import FieldEditorStringLight from "./FieldEditor/FieldEditorStringLight";
import FieldEditorBoolLight from "./FieldEditor/FieldEditorBoolLight";
import CVFormEditExperience from "./CVFormEditExperience";
import CVFormEditEducation from "./CVFormEditEducation";

const cvRepository = RepositoryFactory.getInstance().getCvRepository();

interface ICvFormEditProps {
  cv?: ICvEntity;
  onClose: () => void;
}

export default function CVFormEdit({ cv, onClose }: ICvFormEditProps) {
  const dispatch = useAppDispatch()
  const { cvs } = useAppSelector(state => state.cvsReducer)

  // Flat fields for the form
  const [title, setTitle] = useState(cv ? cv.title : '');
  const [firstName, setFirstName] = useState(cv ? cv.first_name : '');
  const [lastName, setLastName] = useState(cv ? cv.last_name : '');
  const [city, setCity] = useState(cv ? cv.city : '');
  const [country, setCountry] = useState(cv ? cv.country : '');
  const [email, setEmail] = useState(cv ? cv.email : '');
  const [linkedin, setLinkedin] = useState(cv ? cv.linkedin : '');
  const [github, setGithub] = useState(cv ? cv.github : '');
  const [website, setWebsite] = useState(cv ? cv.website : '');
  const [drivingLicense, setDrivingLicense] = useState(cv ? cv.driving_license : false);
  const [skills, setSkills] = useState<string[]>(cv ? cv.skills : []);
  const [interests, setInterests] = useState<string[]>(cv ? cv.interests : []);


  const handleResset = () => {
    if (!cv) {
      setTitle('');
      setFirstName('');
      setLastName('');
      setCity('');
      setCountry('');
      setEmail('');
      setLinkedin('');
      setGithub('');
      setWebsite('');
      setDrivingLicense(false);
      setSkills([]);
      setInterests([]);
    }
    else {
      setTitle(cv.title);
      setFirstName(cv.first_name);
      setLastName(cv.last_name);
      setCity(cv.city || '');
      setCountry(cv.country || '');
      setEmail(cv.email || '');
      setLinkedin(cv.linkedin || '');
      setGithub(cv.github || '');
      setWebsite(cv.website || '');
      setDrivingLicense(cv.driving_license || false);
      setSkills(cv.skills || []);
      setInterests(cv.interests || []);
    }
  };

  const handleCreateCv = async () => {
    try {
      const newCv: Partial<ICvEntity> = {
        title,
        first_name: firstName,
        last_name: lastName,
        city,
        country,
        email,
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
  }

  const handleUpdateCv = async () => {
    if (cv && cv._id) {
      try {
        const updatedCv: Partial<ICvEntity> = {};

        if (title !== cv.title) updatedCv.title = title;
        if (firstName !== cv.first_name) updatedCv.first_name = firstName;
        if (lastName !== cv.last_name) updatedCv.last_name = lastName;
        if (city !== cv.city) updatedCv.city = city;
        if (country !== cv.country) updatedCv.country = country;
        if (email !== cv.email) updatedCv.email = email;
        if (linkedin !== cv.linkedin) updatedCv.linkedin = linkedin;
        if (github !== cv.github) updatedCv.github = github;
        if (website !== cv.website) updatedCv.website = website;
        if (drivingLicense !== cv.driving_license) updatedCv.driving_license = drivingLicense;
        if (JSON.stringify(skills) !== JSON.stringify(cv.skills)) {
          updatedCv.skills = skills;
        }
        if (JSON.stringify(interests) !== JSON.stringify(cv.interests)) {
          updatedCv.interests = interests;
        }

        const updated = await cvRepository.update(cv._id.toString(), updatedCv);
        console.log({ updated });
        if (updated) {
          const newCvList: ICvEntity[] = [...cvs.filter(cv => cv._id?.toString() !== updated._id?.toString()), updated];
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
    }
  }

  const handleSubmit = async () => {
    if (!cv || !cv._id) await handleCreateCv();
    else await handleUpdateCv();
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

      <CVFormEditExperience experience={cv?.experiences ? cv.experiences[0] : undefined} />

      <CVFormEditEducation education={cv?.educations ? cv.educations[0] : undefined} />

      {/* Buttons */}
      <div className="flex justify-end p-2 max-w-xl mt-1">
        {/* Cancel button */}
        <button type="button" onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded">
          Annuler
        </button>

        {/* Reset Button */}
        <button type="reset" onClick={handleResset} className="ml-2 px-4 py-2 bg-gray-300 text-black rounded">
          Réinitialiser
        </button>

        {/* Submit button */}
        <button type="button" onClick={handleSubmit} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
          Enregistrer
        </button>    
      </div>
    

    </div>
  );
}
