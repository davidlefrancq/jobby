import { ICompanyDetails, IJobEntity, ISalary } from "@/types/IJobEntity";
import React, { useState } from "react";
import { RepositoryFactory } from "../dal/RepositoryFactory";
import { useAppDispatch, useAppSelector } from "../store";
import { updateDislikedJob, updateLikedJob, updateUnratedJob } from "../store/jobsReducer";
import { addAlert } from "../store/alertsReducer";
import { addNotification } from "../store/notificationsReducer";
import Link from "next/link";
import FieldEditorLevel from "./FieldEditor/FieldEditorLevel";
import FieldEditorInterestIndicator from "./FieldEditor/FieldEditorInterestIndicator";
import FieldEditorSalary from "./FieldEditor/FieldEditorSalary";
import FieldEditorDescription from "./FieldEditor/FieldEditorDescription";
import FieldEditorTeleworking from "./FieldEditor/FieldEditorTeleworking";
import FieldEditorString from "./FieldEditor/FieldEditorString";
import FieldEditorStringArray from "./FieldEditor/FieldEditorStringArray";
import FieldEditorCompany from "./FieldEditor/FieldEditorCompany";
import BtnDislike from "./Btn/BtnDislike";
import BtnLike from "./Btn/BtnLike";
import BtnRemove from "./Btn/BtnRemove";
import CompanyModal from "./CompanyModal";
import { CloseButton } from "./Btn/CloseButton";
import BtnEditor from "./Btn/BtnEditor";
import { N8NWorkflow } from "../lib/N8NWorkflow";
import FieldEditorTextarea from "./FieldEditor/FieldEditorTextarea";
import MotivationLetterBtn from "./MotivationLetterBtn";
import MotivationEmailBtn from "./MotivationEmailBtn";
import JobMotivationLetterPanel from "./JobMotivationLetterPanel";
import JobMotivationEmailPanel from "./JobMotivationEmailPanel";
import MotivationEmailDraftBtn from "./MotivationEmailDraftBtn";
import JobLinkCv from "./JobLinkCv";

interface JobModalProps {
  onClose: () => void;
}

const jobRepository = RepositoryFactory.getInstance().getJobRepository();

export default function JobModal({ onClose }: JobModalProps) {
  const dispatch = useAppDispatch();
  const { jobSelected } = useAppSelector(state => state.jobsReducer);


  const [isEditMode, setIsEditMode] = useState(false);
  const [companyDelailsSelected, setCompanyDelailsSelected] = useState<ICompanyDetails | null>(null);
  const [showLetterPanel, setShowLetterPanel] = useState(false);
  const [showEmailPanel, setShowEmailPanel] = useState(false);

  const handleToggleEdit = () => {
    setIsEditMode(prev => !prev);
  };

  const handleCompanyDetailsSelect = (details: ICompanyDetails | null | undefined) => {
    if (details) setCompanyDelailsSelected(details);
  };

  const handleCompanyDetailsClose = () => {
    setCompanyDelailsSelected(null);
  };

  const handleJobUpdate = async (values: Partial<IJobEntity>) => {
    // Check if job is valid
    if (!jobSelected || !jobSelected._id) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: "Job entity is not valid.",
        type: "error"
      }));
      return;
    }

    try {
      const jobUpdated = await jobRepository.update(jobSelected._id.toString(), values);
      if (jobUpdated && jobUpdated._id) {
        if (jobUpdated.preference === 'dislike') dispatch(updateDislikedJob(jobUpdated));
        else if (jobUpdated.preference === 'like') dispatch(updateLikedJob(jobUpdated));
        else if (!jobUpdated.preference) dispatch(updateUnratedJob(jobUpdated));

        /** Start N8N Company Details Workflow */
        if (values.company_details && values.company_details.siren) {
          const n8nWorkflow = N8NWorkflow.getInstance();
          const cdwResponse = await n8nWorkflow.startCompanyDetailsWorkflow({ _id: jobUpdated._id.toString() });
          if (cdwResponse.error) {
            dispatch(addAlert({
              date: new Date().toISOString(),
              message: `Failed to start Company Details Workflow: ${cdwResponse.error}`,
              type: "error"
            }));
          } else {
            dispatch(addNotification({
              id: Date.now(),
              message: "Company Details Workflow is complete."
            }));
          }
          
        }
      }
    } catch (error) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: String(error),
        type: "error"
      }));
    }
  }

  const handleTitleUpdate = async (value: string | null) => {
    /** Invalid value */
    if (value === undefined || value === null) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: "Cannot save title with null or undefined value.",
        type: "error"
      }));
    }

    /** Update */
    else {
      try {
        await handleJobUpdate({ title: value })
      } catch (error) {
        dispatch(addAlert({
          date: new Date().toISOString(),
          message: String(error),
          type: "error"
        }));
      }
    }
  }

  const handleContractTypeUpdate = async (value: string | null) => {
    /** Invalid value */
    if (value === undefined) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: "Cannot save contract type with undefined value.",
        type: "error"
      }));
    }

    /** Update */
    else {
      try {
        await handleJobUpdate({ contract_type: value })
      } catch (error) {
        dispatch(addAlert({
          date: new Date().toISOString(),
          message: String(error),
          type: "error"
        }));
      }
    }
  }

  const handleLocationUpdate = async (value: string | null) => {
    /** Invalid value */
    if (value === undefined) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: "Cannot save location with undefined value.",
        type: "error"
      }));
    }

    /** Update */
    else {
      try {
        await handleJobUpdate({ location: value })
      } catch (error) {
        dispatch(addAlert({
          date: new Date().toISOString(),
          message: String(error),
          type: "error"
        }));
      }
    }
  }

  const handleDescriptionUpdate = async (value: string | null) => {
    /** Invalid value */
    if (value === undefined) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: "Cannot save description with undefined value.",
        type: "error"
      }));
    }

    /** Update */
    else {
      try {
        await handleJobUpdate({ description: value })
      } catch (error) {
        dispatch(addAlert({
          date: new Date().toISOString(),
          message: String(error),
          type: "error"
        }));
      }
    }
  }

  const handleContentUpdate = async (value: string | null) => {
    /** Invalid value */
    if (value === undefined) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: "Cannot save content with undefined value.",
        type: "error"
      }));
      return;
    }

    /** Update */
    try {
      await handleJobUpdate({ content: value });
    } catch (error) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: String(error),
        type: "error"
      }));
    }
  }

  const handleTechnologiesUpdate = async (values: string[]) => {
    /** Invalid value */
    if (!Array.isArray(values)) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: "Technologies must be an array.",
        type: "error"
      }));
      return;
    }

    /** Update */
    try {
      await handleJobUpdate({ technologies: values });
    } catch (error) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: String(error),
        type: "error"
      }));
    }
  }

  const handleMethodologiesUpdate = async (values: string[]) => {
    /** Invalid value */
    if (!Array.isArray(values)) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: "Methodologies must be an array.",
        type: "error"
      }));
      return;
    }

    /** Update */
    try {
      await handleJobUpdate({ methodologies: values });
    } catch (error) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: String(error),
        type: "error"
      }));
    }
  }

  const handleTeleworkingUpdate = async (value: boolean) => {
    /** Invalid value */
    if (typeof value !== "boolean") {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: "Teleworking must be a boolean.",
        type: "error"
      }));
      return;
    }

    /** Update */
    try {
      await handleJobUpdate({ teleworking: value });
    } catch (error) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: String(error),
        type: "error"
      }));
    }
  }

  const handleLanguageUpdate = async (value: string | null) => {
    /** Invalid value */
    if (value === undefined) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: "Cannot save language with undefined value.",
        type: "error"
      }));
    }

    /** Update */
    else {
      try {
        await handleJobUpdate({ language: value });
      } catch (error) {
        dispatch(addAlert({
          date: new Date().toISOString(),
          message: String(error),
          type: "error"
        }));
      }
    }
  }

  const handleLevelUpdate = async (value: string | null) => {
    /** Invalid value */
    if (value === undefined) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: "Cannot save level with undefined value.",
        type: "error"
      }));
      return;
    }

    /** Update */
    try {
      await handleJobUpdate({ level: value });
    } catch (error) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: String(error),
        type: "error"
      }));
    }
  }

  const handleSalaryUpdate = async (value: ISalary | null) => {
    /** Invalid value */
    if (value === undefined || value === null) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: "Cannot save salary with null or undefined value.",
        type: "error"
      }));
      return;
    }

    /** Update */
    try {
      await handleJobUpdate({ salary: value });
    } catch (error) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: String(error),
        type: "error"
      }));
    }
  }

  const handleInterestIndicatorUpdate = async (value: string | null) => {
    /** Invalid value */
    if (value === undefined || value === null) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: "Cannot save interest indicator with null or undefined value.",
        type: "error"
      }));
      return;
    }

    /** Update */
    try {
      await handleJobUpdate({ interest_indicator: value });
    } catch (error) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: String(error),
        type: "error"
      }));
    }
  }

  return (
    <>
      {jobSelected && <>
        {/* Button Bar */}
        <div className={"absolute top-4 right-4 flex items-center gap-2"}>
          {/* Edit Mode Button */}
          <BtnEditor onClick={handleToggleEdit} className="text-gray-500 hover:text-black" isEditMode={isEditMode} autoPositionning={false} />
          
          {/* Close Button */}
          <CloseButton onClick={onClose} className="text-gray-500 hover:text-black" autoPositionning={false} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-0 text-gray-800">
          <FieldEditorString
            initialValue={jobSelected.title}
            isEditMode={isEditMode}
            legendValue={"Title"}
            saveFunction={handleTitleUpdate}
          />
        </h2>
        <div className="flex text-sm text-gray-500 mb-0">
          {/* Company */}
          <span
            className={`py-2.5 mr-1 ${!isEditMode && jobSelected.company_details?.siren ? 'cursor-pointer caret-transparent hover:ps-2 hover:pe-2 hover:rounded-xl hover:shadow-xl hover:text-white hover:bg-blue-600 focus:ring-4 focus:ring-blue-300' : ''}`}
            onClick={!isEditMode ? () => handleCompanyDetailsSelect(jobSelected.company_details) : undefined}
          >
            <FieldEditorCompany
              job={jobSelected}
              isEditMode={isEditMode}
              saveFunction={handleJobUpdate}
            />
          </span>
          
          <span className="py-2.5 mr-1"> • </span>
          
          {/* Contract Type */}
          <span className="py-2.5 mr-1">
            <FieldEditorString
              initialValue={jobSelected.contract_type}
              isEditMode={isEditMode}
              legendValue={"Contract type"}
              saveFunction={handleContractTypeUpdate}
            />
          </span>
          
          <span className="py-2.5 mr-1"> • </span>
          
          {/* Location */}
          <span className="py-2.5 mr-1">
            <FieldEditorString
              initialValue={jobSelected.location}
              isEditMode={isEditMode}
              legendValue={"Location"}
              saveFunction={handleLocationUpdate}
            />
          </span>
        </div>

        <JobLinkCv job={jobSelected} />

        {/* Description */}
        <div className="text-sm text-gray-700 whitespace-pre-line mb-6 text-justify">
          <FieldEditorDescription
            job={jobSelected}
            isEditMode={isEditMode}
            saveAction={handleDescriptionUpdate}
          />
        </div>

        {/* Content */}
        <div className="text-sm text-gray-700 whitespace-pre-line mb-6 text-justify">
          <span className="font-bold">Annonce  complète :</span>
          <FieldEditorTextarea
            initialValue={jobSelected.content || ''}
            isEditMode={isEditMode}
            legendValue={"Content"}
            saveFunction={handleContentUpdate}
          />
        </div>

        <div className="grid grid-cols-2 text-sm text-gray-600">
          <div className="pr-2">
            {/* Technologies */}
            <div className="">
              <span className="min-w-30 mt-0 mb-auto py-2.5 mr-1 font-bold">
                Technologies :
              </span>
              <FieldEditorStringArray
                items={jobSelected.technologies}
                isEditMode={isEditMode}
                saveFunction={handleTechnologiesUpdate}
              />
            </div>
            
            {/* Methodologies */}
            <div className="">
              <span className="min-w-30 mt-0 mb-auto py-2.5 mr-1 font-bold">
                Méthodologies :
              </span>
              <FieldEditorStringArray
                items={jobSelected.methodologies}
                isEditMode={isEditMode}
                saveFunction={handleMethodologiesUpdate}
              />
            </div>
            
            {/* Teleworking */}
            <div className="flex items-center">
              <span className="min-w-30 mt-0 mb-auto py-2.5 mr-1 font-bold">
                Télétravail :
              </span>
              <FieldEditorTeleworking
                job={jobSelected}
                isEditMode={isEditMode}
                saveFunction={handleTeleworkingUpdate}
              />
            </div>

            {/* Language */}
            <div className="flex items-center">
              <span className="min-w-30 mt-0 mb-auto py-2.5 mr-1 font-bold">
                Langue :
              </span>
              <FieldEditorString
                initialValue={jobSelected.language}
                isEditMode={isEditMode}
                saveFunction={handleLanguageUpdate}
              />
            </div>
          </div>
          <div>
            {/* Level */}
            <div className="flex items-center">
              <span className="min-w-15 mt-0 mb-auto py-2.5 mr-1 font-bold">
                Niveau :
              </span>
              <FieldEditorLevel
                job={jobSelected}
                isEditMode={isEditMode}
                saveFunction={handleLevelUpdate}
              />
            </div>

            {/* Salary */}
            <div className="py-2.5">
              <span className="min-w-15 mt-0 mb-auto mr-1 font-bold">
                Salaire :
              </span>
              <FieldEditorSalary
                job={jobSelected}
                isEditMode={isEditMode}
                saveFunction={handleSalaryUpdate}
              />
            </div>

            {/* Interest Indicator */}
            <div className="flex items-center">
              <span className="min-w-15 mt-0 mb-auto py-2.5 mr-1 font-bold">
                Intérêt :
              </span>
              <FieldEditorInterestIndicator
                job={jobSelected}
                isEditMode={isEditMode}
                saveFunction={handleInterestIndicatorUpdate}
              />
            </div>

            {/* Source */}
            <div className="flex items-center">
              <span className="min-w-15 mt-0 mb-auto py-2.5 mr-1"><strong>Source :</strong></span>
              {jobSelected.source 
                ? <Link href={jobSelected.source} target="_blank" className="text-blue-500 hover:underline">
                    {jobSelected.source && new URL(jobSelected.source).hostname || jobSelected.source}
                  </Link>
                : <span className="text-gray-400">
                    {'[N/A]'}
                  </span>}
              {jobSelected.original_job_id ? <span className="ms-1">{`- Ref: ${jobSelected.original_job_id}`}</span> : ''}
            </div>
          </div>
        </div>

        <div className="flex flex-row w-full mt-4 mb-6 gap-2">
          {/* Motivation Letter */}
          {!showLetterPanel && (
            <div className="mb-4">
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setShowLetterPanel(true)}
              >
                View/Edit Motivation Letter
              </button>
            </div>
          )}
          {showLetterPanel && (
            <JobMotivationLetterPanel job={jobSelected} onClose={() => { setShowLetterPanel(false) }} />
          )}

          {/* Motivation Email */}
          {!showEmailPanel && (
            <div className="mb-4">
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setShowEmailPanel(true)}
              >
                View/Edit Motivation Email
              </button>
            </div>
          )}
          { showEmailPanel && (
            <JobMotivationEmailPanel job={jobSelected} onClose={() => { setShowEmailPanel(false) }} />
          )}

          
          {jobSelected.motivation_email_draft_url ? (
            <div>
              <button
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => window.open(jobSelected.motivation_email_draft_url || '', '_blank')}
                title="Open Draft Email"
              >
                Open Draft Email
              </button>
            </div>
          ) : null}

        </div>

        {/* Actions */}
        <div className="flex flex-row w-full">
          {/* Colonne 1 */}
          <div className="flex-1 flex items-center justify-center gap-2">
            <MotivationLetterBtn jobId={jobSelected._id?.toString() || null} cvId={jobSelected?.cv_id || null} />
            <MotivationEmailBtn jobId={jobSelected._id?.toString() || null} cvId={jobSelected?.cv_id || null} />
            <MotivationEmailDraftBtn jobId={jobSelected._id?.toString() || null} cvId={jobSelected?.cv_id || null} />
          </div>

          {/* Colonne 2 */}
          <div className="flex-1 flex items-center justify-center">
            <span className="text-gray-400">{jobSelected._id ? jobSelected._id.toString() : '[N/A]'}</span>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <BtnRemove job={jobSelected} onRemove={() => onClose()} />
          {jobSelected.preference === 'dislike' && <BtnLike job={jobSelected} onClose={() => onClose()} />}
          {jobSelected.preference === 'like' && <BtnDislike job={jobSelected} onClose={() => onClose()} />}
        </div>

        {companyDelailsSelected && (
          <CompanyModal data={companyDelailsSelected} onClose={handleCompanyDetailsClose} />
        )}
      </>}
    </>
  );
}