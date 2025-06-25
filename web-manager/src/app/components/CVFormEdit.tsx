import { useState } from "react";
import { ICvEntity, IExperience, IEducation } from "@/types/ICvEntity";
import { RepositoryFactory } from "../dal/RepositoryFactory";
import { useAppDispatch, useAppSelector } from "../store";
import { addAlert } from "../store/alertsReducer";
import { setCvs, setCvsCounter } from "../store/cvsReducer";
import FieldEditorStringArrayLight from "./FieldEditor/FieldEditorStringArrayLight";
import FieldEditorStringLight from "./FieldEditor/FieldEditorStringLight";
import FieldEditorBoolLight from "./FieldEditor/FieldEditorBoolLight";
import CVFormEditExperience, { IExperienceSaveFunctionParams } from "./CVFormEditExperience";
import CVFormEditEducation, { IEducationSaveFunctionParams } from "./CVFormEditEducation";
import TruncatedText from "./TruncatedText";

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
  const [experiences, setExperiences] = useState<IExperience[]>(cv ? cv.experiences : []);
  const [educations, setEducations] = useState<IEducation[]>(cv ? cv.educations : []);

  // Selected elements
  const [selectedExperience, setSelectedExperience] = useState<IExperience | undefined>(undefined);
  const [selectedEducation, setSelectedEducation] = useState<IEducation | undefined>(undefined);


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

  const handleAddExperience = ({ experience, initialValue }: IExperienceSaveFunctionParams) => {
    const filterFunction = (exp: IExperience) => {
      // Check if the experience already exists in the list
      let isDifferent = exp.title !== experience.title;
      if (initialValue) {
        // Check if the experience is different from the initial value
        // (to replace original by the new one)
        const isDifferentAsInit = exp.title !== initialValue.title;
        if (!isDifferentAsInit) isDifferent = isDifferentAsInit;
      }
      return isDifferent;
    }
    const experiencesWithoutNew = experiences.filter(filterFunction);
    const newExperiences = [...experiencesWithoutNew, experience];
    setExperiences(newExperiences);
  }

  const handleAddEducation = ({ education, initialValue }: IEducationSaveFunctionParams) => {
    const filterFunction = (edu: IEducation) => {
      // Check if the education already exists in the list
      let isDifferent = edu.title !== education.title;
      if (initialValue) {
        // Check if the education is different from the initial value
        // (to replace original by the new one)
        const isDifferentAsInit = edu.title !== initialValue.title;
        if (!isDifferentAsInit) isDifferent = isDifferentAsInit;
      }
      return isDifferent;
    }
    const educationsWithoutNew = educations.filter(filterFunction);
    const newEducations = [...educationsWithoutNew, education];
    setEducations(newEducations);
  }

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
        educations,
        experiences,
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
        // Prepare the updated CV object
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
        if (JSON.stringify(experiences) !== JSON.stringify(cv.experiences)) {
          updatedCv.experiences = experiences;
        }
        if (JSON.stringify(educations) !== JSON.stringify(cv.educations)) {
          updatedCv.educations = educations;
        }

        // Call the repository to update the CV
        const updated = await cvRepository.update(cv._id.toString(), updatedCv);
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
      <FieldEditorStringLight
        className="mt-1"
        initialValue={title}
        saveFunction={(value) => setTitle(value)}
        legendValue="Titre du CV"
      />

      {/* First name */}
      <FieldEditorStringLight
        className="mt-1"
        initialValue={firstName}
        saveFunction={(value) => setFirstName(value)}
        legendValue="Prénom"
      />

      {/* Last name */}
      <FieldEditorStringLight
        className="mt-1"
        initialValue={lastName}
        saveFunction={(value) => setLastName(value)}
        legendValue="Nom"
      />

      {/* Email */}
      <FieldEditorStringLight
        className="mt-1"
        initialValue={email}
        saveFunction={(value) => setEmail(value)}
        legendValue="Email"
      />
      
      {/* City */}
      <FieldEditorStringLight
        className="mt-1"
        initialValue={city}
        saveFunction={(value) => setCity(value)}
        legendValue="Ville"
      />
      
      {/* Country */}
      <FieldEditorStringLight
        className="mt-1"
        initialValue={country}
        saveFunction={(value) => setCountry(value)}
        legendValue="Pays"
        />
      
      {/* Driving License Checkbox */}
      <FieldEditorBoolLight
        className="mt-1"
        initialValue={drivingLicense}
        saveFunction={(value) => setDrivingLicense(value)}
        legendValue="Permis de conduire"
      />

      {/* Linkedin */}
      <FieldEditorStringLight
        className="mt-1"
        initialValue={linkedin}
        saveFunction={(value) => setLinkedin(value)}
        legendValue="LinkedIn"
      />

      {/* Github */}
      <FieldEditorStringLight
        className="mt-1"
        initialValue={github}
        saveFunction={(value) => setGithub(value)}
        legendValue="GitHub"
      />

      {/* Website */}
      <FieldEditorStringLight
        className="mt-1"
        initialValue={website}
        saveFunction={(value) => setWebsite(value)}
        legendValue="Site web"
      />

      {/** Skills */}
      <div className="mt-2 shadow-sm rounded-md p-2 max-w-xl bg-blue-50">
        <label className="block text-sm font-medium text-gray-700">Compétences</label>
        <p className="text-xs text-gray-500">List des compétences et outils professionnels que vous maîtrisez.</p>
        <FieldEditorStringArrayLight
          className={"mt-1"}
          items={skills}
          saveFunction={(value) => setSkills(value)}
          legendValue={"Compétences"}
        />
      </div>

      {/* Interests */}
      <div className="mt-2 shadow-sm rounded-md p-2 max-w-xl bg-blue-50">
        <label className="block text-sm font-medium text-gray-700">
          {`Centres d'intérêt`}
        </label>
        <p className="text-xs text-gray-500">
          {`Liste de vos centres d'intérêt, séparés par des virgules.`}
        </p>
        <FieldEditorStringArrayLight
          className={"mt-1"}
          items={interests}
          saveFunction={(value) => setInterests(value)}
          legendValue={"Centres d'intérêt"}
        />
      </div>

      <div className="mt-2 shadow-sm rounded-md p-2 max-w-xl bg-blue-50">
        <label className="block text-sm font-medium text-gray-700">Expériences professionnelles</label>
        <p className="text-xs text-gray-500">Liste de vos expériences professionnelles.</p>
        <CVFormEditExperience
          experience={selectedExperience}
          saveFunction={handleAddExperience}
        />
        {experiences.length > 0 && (
          <div>
            {/* Cards of experiences */}
            { experiences.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {experiences.map((exp, index) => (
                  <div key={index} className="bg-white p-4 rounded shadow">
                    <h4 className="font-semibold">{exp.title}</h4>
                    <p className="text-xs text-gray-500">{exp.company}</p>
                    <p className="text-xs text-gray-500">
                      {exp.dateStart ? new Date(exp.dateStart).toLocaleDateString() : null}
                      {exp.dateStart && exp.dateEnd ? ' - ' : null}
                      {exp.dateEnd ? new Date(exp.dateEnd).toLocaleDateString() : null}
                    </p>
                    <p className="text-xs text-gray-700 mt-1">
                      <TruncatedText text={exp.description} length={100} />
                    </p>

                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        const newExperiences = experiences.filter((_, i) => i !== index);
                        setExperiences(newExperiences);
                      }}
                      className="mt-2 text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>

                    {/* Edit button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedExperience(exp);
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-900"
                    >
                      Modifier
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-2 shadow-sm rounded-md p-2 max-w-xl bg-blue-50">
        <label className="block text-sm font-medium text-gray-700">Formations</label>
        <p className="text-xs text-gray-500">Liste de vos formations.</p>
        <CVFormEditEducation
          education={selectedEducation}
          saveFunction={handleAddEducation}
        />
        {educations.length > 0 && (
          <div>
            {/* Cards of educations */}
            {educations.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {educations.map((edu, index) => (
                  <div key={index} className="bg-white p-4 rounded shadow">
                    <h4 className="font-semibold">{edu.title}</h4>
                    <p className="text-xs text-gray-500">{edu.institution}</p>
                    <p className="text-xs text-gray-500">
                      {edu.dateStart ? new Date(edu.dateStart).toLocaleDateString() : null}
                      {edu.dateStart && edu.dateEnd ? ' - ' : null}
                      {edu.dateEnd ? new Date(edu.dateEnd).toLocaleDateString() : null}
                    </p>
                    <p className="text-xs text-gray-700 mt-1">
                      <TruncatedText text={edu.description} length={100} />
                    </p>

                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        const newEducations = educations.filter((_, i) => i !== index);
                        setEducations(newEducations);
                      }}
                      className="mt-2 text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>

                    {/* Edit button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedEducation(edu);
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-900"
                    >
                      Modifier
                    </button>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

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
