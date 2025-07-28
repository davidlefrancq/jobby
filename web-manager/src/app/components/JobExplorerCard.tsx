import { IJobEntity } from "@/types/IJobEntity";
import TruncatedText from "./TruncatedText";
import JobStatus from "./JobStatus";
import LanguageFlag from "./LanguageFlag";
import SalaryItem from "./SalaryItem";
import FieldEditorCompanySiren from "./FieldEditor/FieldEditorCompanySiren";
import { ArrowBigDownDash, FileText, Info, Logs, Mail, SquareArrowOutUpRight } from "lucide-react";
import { JobTools } from "../lib/JobTools";
import { useAppDispatch } from "../store";
import { addAlert } from "../store/alertsReducer";
import { RepositoryFactory } from "../dal/RepositoryFactory";
import { updateDislikedJob, updateLikedJob, updateUnratedJob } from "../store/jobsReducer";
import { N8NWorkflow } from "../lib/N8NWorkflow";
import { addNotification } from "../store/notificationsReducer";
import { MessageType } from "@/types/MessageType";
import JobTags from "./JobTags";
import JobDislikeBtn from "./JobDislikeBtn";
import JobStepper from "./JobStepper";
import { useState } from "react";
import BtnLoading from "./Btn/BtnLoading";
import JobTabsMenu from "./JobTabsMenu";
import JobCvSelector from "./JobCvSelector";
import JobMotivationLetter from "./JobMotivationLetter";
import JobMotivationEmail from "./JobMotivationEmail";

const jobRepository = RepositoryFactory.getInstance().getJobRepository();
const n8nWorkflow = N8NWorkflow.getInstance();

interface JobExplorerCardProps {
  job: IJobEntity;
}

export default function JobExplorerCard({ job }: JobExplorerCardProps) {
  const dispatch = useAppDispatch();

  const [jobCompanyInUpdateing, setJobCompanyInUpdating] = useState(false);

  /**
   * FR: Ajoute un message d'erreur à la liste des alertes
   * EN: Adds an error message to the alert list
   */
  const handleAddError = (message: string, type: MessageType) => {
    const errorMessage = {
      date: new Date().toISOString(),
      message,
      type,
    };
    dispatch(addAlert(errorMessage));
  }

  /**
   * FR: Met à jour les détails de l'entreprise du job
   * EN: Updates the company details of the job
   */
  const updateJobCompany = async (job: Partial<IJobEntity>) => {
    // Check if job is valid
    if (!job || !job._id) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: "Job entity is not valid.",
        type: "error"
      }));
      return;
    }
    setJobCompanyInUpdating(true);

    try {
      const { _id, ...jobData} = job
      if (_id) {
        const jobUpdateResponse = await jobRepository.update(String(_id), jobData);
        if (jobUpdateResponse && jobUpdateResponse._id) {
          // Update the job in the store
          if (jobUpdateResponse.preference === 'dislike') dispatch(updateDislikedJob(jobUpdateResponse));
          else if (jobUpdateResponse.preference === 'like') dispatch(updateLikedJob(jobUpdateResponse));
          else if (!jobUpdateResponse.preference) dispatch(updateUnratedJob(jobUpdateResponse));

          /** Start N8N Company Details Workflow */
          if (job.company_details && job.company_details.siren) {
            const cdwResponse = await n8nWorkflow.startCompanyDetailsWorkflow({ _id: jobUpdateResponse._id.toString() });
            if (cdwResponse.error) {
              dispatch(addAlert({
                date: new Date().toISOString(),
                message: `Failed to start Company Details Workflow: ${cdwResponse.error}`,
                type: "error"
              }));
            } else {
              const jobUpdated = await jobRepository.getById(jobUpdateResponse._id.toString());
              if (jobUpdated) {
                if (jobUpdated.preference === 'dislike') dispatch(updateDislikedJob(jobUpdated));
                else if (jobUpdated.preference === 'like') dispatch(updateLikedJob(jobUpdated));
                else if (!jobUpdated.preference) dispatch(updateUnratedJob(jobUpdated));
                dispatch(addNotification({
                  id: Date.now(),
                  message: `Company Details has been updated for job ${jobUpdateResponse._id}`,
                }));
              } else {
                handleAddError(`Failed to retrieve updated job after Company Details Workflow: ${String(_id)}`, 'error');
              }
            }
            
          }
        } else {
          handleAddError(`Failed to update job: ${String(_id)}`, 'error');
        }
      }
    } catch (error) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: String(error),
        type: "error"
      }));
    } finally {
      setJobCompanyInUpdating(false);
    }
  }

  return (
    <div key={job._id?.toString()} className="col-span-1">
      <div
        className="w-full h-full bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70"
      >
        {/* Card Header */}
        <div className="bg-gray-100 border-b border-gray-200 rounded-t-xl py-3 px-4 dark:bg-neutral-900 dark:border-neutral-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            <TruncatedText text={job.title || "Unknown Title"} length={55} />
          </h3>

          <div className="flex gap-2 mt-1 text-sm text-gray-500 dark:text-neutral-500">
            <JobStatus job={job} showLegend={false} />
            <LanguageFlag language={job.language || ''} cssStyle='w-4 h-4' />
            <TruncatedText text={job.contract_type || '[Contract type N/A]'} length={25} />
            <span className="ml-auto mr-0">
              <SalaryItem salary={job.salary} />
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <JobStepper job={job} />
        </div>

        <div className="h-[400px] ps-4 pe-4 pt-0 pv-auto overflow-auto">

          <div className="flex grid-cols-3 gap-2 mb-2">
            <span className="flex justify-center items-center pl-2 pr-2 rounded text-sm bg-white text-gray-800 dark:text-neutral-200 dark:bg-neutral-800">
              <TruncatedText text={job.company || ''} length={35} />
            </span>
            <span className="flex justify-center items-center pl-2 pr-2 rounded text-sm bg-white text-gray-800 dark:text-neutral-200 dark:bg-neutral-800">
              <TruncatedText text={job.location || ''} length={35} />
            </span>
            <span className={`
              h-8
              flex justify-center items-center 
              ${job.company_details?.siren ? 'pl-2 pr-2' : 'px-0 my-0'}
              rounded
              text-sm
              ${job.company_details?.siren && 'bg-white'}
              text-gray-800
              dark:text-neutral-200
              ${job.company_details?.siren && 'dark:bg-neutral-800'}
            `}>
              {job.company_details?.siren
                ? job.company_details?.siren
                : <FieldEditorCompanySiren job={job} isEditMode={true} saveFunction={updateJobCompany} />
              }
            </span>
          </div>

          {jobCompanyInUpdateing || job.company_details?.siren && (
            <div className="mb-2 flex grid-cols-3 gap-2">
              {/* Spinner if jobCompanyInUpdateing === true */}
              { jobCompanyInUpdateing && (
                <span className="min-h-8 w-full flex justify-center items-center pl-2 pr-2 rounded text-sm bg-white text-gray-800 dark:text-neutral-200 dark:bg-neutral-800">
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
                </span>
              )}
              {/* Button Update Job Companu Details if details not exist */}
              { !jobCompanyInUpdateing && job.company_details?.siren && !job.company_details?.description && (
                <BtnLoading
                  title={<span className="flex justify-center items-center gap-1"><ArrowBigDownDash />Update Company Details</span>}
                  loading={jobCompanyInUpdateing}
                  onClick={() => updateJobCompany(job)}
                  width="200px"
                  height="32px"
                  rounded="rounded-md"
                  isDisabled={!!job.company_details?.description}
                />
              )}

              { (job.company_details?.description) && (
                <span className="min-h-8 flex justify-center items-center pl-2 pr-2 rounded text-sm bg-white text-gray-800 dark:text-neutral-200 dark:bg-neutral-800">
                  <TruncatedText text={job.company_details.description} length={120} />
                </span>
              )}
              { (job.company_details?.naf_ape?.activity || job.company_details?.naf_ape?.code) && (
                <span className="min-h-8 flex justify-center items-center pl-2 pr-2 rounded text-sm bg-white text-gray-800 dark:text-neutral-200 dark:bg-neutral-800">
                  <TruncatedText text={job.company_details.naf_ape.activity || job.company_details.naf_ape.code || ''} length={35} />
                </span>
              )}
              { job.company_details?.website && (
                <span className="min-h-8 flex justify-center items-center pl-2 pr-2 rounded text-sm bg-white text-gray-800 dark:text-neutral-200 dark:bg-neutral-800">
                  <a href={job.company_details.website} target="_blank" rel="noopener noreferrer">
                    {job.company_details.website}
                  </a>
                </span>
              )}
            </div>
        )}

          <JobTabsMenu
            items={[
              { label: 'Description', icon: <Info /> },
              { label: 'CV', icon: <Logs /> },
              { label: 'Lettre', icon: <FileText /> },
              { label: 'Email', icon: <Mail /> },
            ]}
          >
            <div className="min-h-[150px] mt-2 text-gray-500 dark:text-neutral-400 text-justify">
              {job.description ? job.description : 'No description available.'}
            </div>
            <div className="min-h-[150px] text-gray-500 dark:text-neutral-400">
              <JobCvSelector job={job} />
            </div>
            <div className="min-h-[150px] text-gray-500 dark:text-neutral-400">
              <JobMotivationLetter job={job} />
            </div>
            <div className="min-h-[150px] text-gray-500 dark:text-neutral-400">
              {/* {job.motivation_email ? job.motivation_email : 'No email available.'} */}
              <JobMotivationEmail job={job} />
            </div>
          </JobTabsMenu>

          <JobTags job={job} />

          <div className="flex justify-end mt-4 gap-2 dark:text-neutral-400">
            <span></span>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="h-[65px] flex justify-center items-center bg-gray-100 border-t border-gray-200 rounded-b-xl py-3 px-4 md:py-4 md:px-5 dark:bg-neutral-900 dark:border-neutral-700">
          <div className="flex-auto mt-1 mb-1 text-sm text-gray-500 dark:text-neutral-500">
            {/* Job date */}
            {job.date ? new Date(job.date).toLocaleDateString() : 'N/A'}
          </div>
          <div className="flex-auto mt-1 mb-1 text-sm text-center text-gray-500 dark:text-neutral-500">
            {/* Job ID */}
            <div>{job._id?.toString()}</div>
            {job.original_job_id && (
              <div>
                {job.original_job_id}
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-1 mb-1 text-sm text-right text-gray-500 dark:text-neutral-500">
            {/* Dislike Button */}
            <JobDislikeBtn job={job} />
            {/* Original job url */}
            {job.original_job_id && job.source
              ? <button
                  className="min-w-[150px] px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  onClick={() => window.open(job.source || '', '_blank')}
                >
                  <span className="flex gap-2 justify-center items-center capitalize">
                    <SquareArrowOutUpRight size={18} />
                    {JobTools.getSourceName(job)}
                  </span>
                </button>
              : 'N/A'
            }
          </div>
        </div>

      </div>
    </div>
  );
}