import { useEffect, useState } from "react";
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
import StepManager from "./Annimation/StepManager";
import Step from "./Annimation/Step";

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

  // Progress steps
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 6;

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
    const compareExperience = (e1: IExperience, e2: IExperience) => {
      const value1 = JSON.stringify({ 
          title: e1.title,
          company: e1.company,
       });
      const value2 = JSON.stringify({ 
          title: e2.title,
          company: e2.company,
       });
      return value1 === value2;
    }

    const filterFunction = (exp: IExperience) => {
      // Check if the experience already exists in the list
      let isDifferent = !compareExperience(exp, experience)
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

  // Close the form when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="p-4 bg-white shadow-xl rounded-lg max-w-2xl mx-auto">
      <div className="flex">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2">CV Editor</h3>
        </div>
        <div className="flex-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded w-[110px]">
            Annuler
          </button> 
        </div>
      </div>

      {/* Steps menu */}
      <div className="flex justify-between items-center mt-4">
        <button
          type="button"
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50 w-[110px]"
        >
          Précédent
        </button>

        <span className="text-sm text-gray-600">
          Étape {currentStep + 1} / {totalSteps}
        </span>

        {(currentStep !== totalSteps - 1) && <button
          type="button"
          onClick={() => setCurrentStep((s) => Math.min(totalSteps - 1, s + 1))}
          disabled={currentStep === totalSteps - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 w-[110px]"
        >
          Suivant
        </button>}

        {currentStep === totalSteps - 1 && (
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded w-[110px]"
          >
            Enregistrer
          </button>
        )}
      </div>

      <StepManager currentStep={currentStep}>
        <Step stepKey={0}>
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
        </Step>

        <Step stepKey={1}>
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
        </Step>

        <Step stepKey={2}>
          {/** Skills */}
          <div className="mt-2 shadow-sm rounded-md p-2 bg-blue-50">
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
          <div className="mt-2 shadow-sm rounded-md p-2 bg-blue-50">
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
        </Step>

        <Step stepKey={3}>
          <div className="mt-2 shadow-sm rounded-md p-2 bg-blue-50">
            <label className="block text-sm font-medium text-gray-700">Expériences professionnelles</label>
            <p className="text-xs text-gray-500">Liste de vos expériences professionnelles.</p>
            
            {/* Experience edit form */}
            <CVFormEditExperience
              experience={selectedExperience}
              saveFunction={handleAddExperience}
            />
            
            {/* Cards of experiences */}
            {experiences.length > 0 && (
              <div>
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
        </Step>

        <Step stepKey={4}>
          <div className="mt-2 shadow-sm rounded-md p-2 bg-blue-50">
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
        </Step>

        <Step stepKey={5}>
          {/* Summary of the CV */}
          <div className="flex justify-end p-2 max-w-xl mt-1">
            <div className="flex-1">
              <h4 className="text-lg font-semibold">Récapitulatif</h4>
              <p className="text-xs text-gray-500 mb-4">Vérifiez les informations saisies avant de sauvegarder.</p>
              
              {/* Personal info */}
              <div className="mt-2 shadow-md rounded-md p-2">
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-sm">{firstName} {lastName} ({city} {country})</p>
                <p className="text-sm">{email}</p>
              </div>
              <div className="mt-2 shadow-md rounded-md p-2">
                <p><span className="text-sm font-semibold">Permis de conduire:</span> {drivingLicense ? 'oui' : 'non'}</p>
              </div>
              
              {/* Skills */}
              <div className="mt-2 shadow-md rounded-md p-2">
                <p><span className="text-md font-semibold">Compétences:</span></p>
                {skills.length > 0 && <p className="text-sm">
                  {skills.map((skill, index) => (
                    <span key={index} className="inline-block bg-gray-200 text-gray-800 rounded-full px-2 py-1 text-xs mr-1 mb-1">
                      #{skill}
                    </span>
                  ))}
                </p>}
              </div>
              
              {/* Interests */}
              <div className="mt-2 shadow-md rounded-md p-2">
                <p><span className="text-md font-semibold">Centres d'intérêt:</span></p>
                {interests.length > 0 && <p className="text-sm">
                  {interests.map((interest, index) => (
                    <span key={index} className="inline-block bg-gray-200 text-gray-800 rounded-full px-2 py-1 text-xs mr-1 mb-1">
                      #{interest}
                    </span>
                  ))}
                </p>}
              </div>

              {/* Experiences */}
              {experiences.length > 0 && (
                <div className="mt-2 shadow-md rounded-md p-2">
                  <h5 className="text-sm font-semibold">Expériences professionnelles:</h5>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                      {experiences.map((exp, index) => (
                        <div key={index} className="bg-white p-4 rounded border border-gray-400">
                          <h4 className="font-semibold">{exp.title}</h4>
                          <p className="text-xs text-gray-500">{exp.company}</p>
                          <p className="text-xs text-gray-500">
                            {exp.dateStart ? new Date(exp.dateStart).toLocaleDateString() : null}
                            {exp.dateStart && exp.dateEnd ? ' - ' : null}
                            {exp.dateEnd ? new Date(exp.dateEnd).toLocaleDateString() : null}
                          </p>
                          <p className="text-xs text-gray-700 mt-1">
                            {exp.description}
                          </p>
                        </div>
                      ))}
                    </div>
                </div>
              )}

              {/* Educations */}
              {educations.length > 0 && (
                <div className="mt-2 shadow-md rounded-md p-2">
                  <h5 className="text-sm font-semibold">Formations:</h5>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                      {educations.map((edu, index) => (
                        <div key={index} className="bg-white p-4 rounded border border-gray-400">
                          <h4 className="font-semibold">{edu.title}</h4>
                          <p className="text-xs text-gray-500">{edu.institution}</p>
                          <p className="text-xs text-gray-500">
                            {edu.dateStart ? new Date(edu.dateStart).toLocaleDateString() : null}
                            {edu.dateStart && edu.dateEnd ? ' - ' : null}
                            {edu.dateEnd ? new Date(edu.dateEnd).toLocaleDateString() : null}
                          </p>
                          <p className="text-xs text-gray-700 mt-1">
                            {edu.description}
                          </p>
                        </div>
                      ))}
                    </div>
                </div>
              )}

            </div>
                
          </div>
        </Step>
      </StepManager>    
    </div>
  );
}
