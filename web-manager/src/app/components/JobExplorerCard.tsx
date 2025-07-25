import { IJobEntity } from "@/types/IJobEntity";
import TruncatedText from "./TruncatedText";
import JobStatus from "./JobStatus";
import LanguageFlag from "./LanguageFlag";
import SalaryItem from "./SalaryItem";
import FieldEditorCompanySiren from "./FieldEditor/FieldEditorCompanySiren";
import { SquareArrowOutUpRight } from "lucide-react";
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

const jobRepository = RepositoryFactory.getInstance().getJobRepository();

interface JobExplorerCardProps {
  job: IJobEntity;
}

export default function JobExplorerCard({ job }: JobExplorerCardProps) {
  const dispatch = useAppDispatch();

  const handleAddError = (message: string, type: MessageType) => {
    const errorMessage = {
      date: new Date().toISOString(),
      message,
      type,
    };
    dispatch(addAlert(errorMessage));
  }

  const updateJob = async (job: Partial<IJobEntity>) => {
    // Check if job is valid
    if (!job || !job._id) {
      dispatch(addAlert({
        date: new Date().toISOString(),
        message: "Job entity is not valid.",
        type: "error"
      }));
      return;
    }

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
            const n8nWorkflow = N8NWorkflow.getInstance();
            const cdwResponse = await n8nWorkflow.startCompanyDetailsWorkflow({ _id: jobUpdateResponse._id.toString() });
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
    }
  }

  return (
    <div key={job._id?.toString()} className="col-span-1">
      <div
        className="w-full h-full bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70"
      >
        {/* Card Header */}
        <div className="bg-gray-100 border-b border-gray-200 rounded-t-xl py-3 px-4 md:py-4 md:px-5 dark:bg-neutral-900 dark:border-neutral-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            <TruncatedText text={job.title || "Unknown Title"} length={35} />
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

        <div className="h-[400px] p-4">

          <div className="flex flex-col-3 gap-2">
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
                : <FieldEditorCompanySiren job={job} isEditMode={true} saveFunction={updateJob} />
              }
            </span>
          </div>

          <div className="mt-2 flex flex-col-3 gap-2">
            { (job.company_details?.description) && (
              <span className="flex justify-center items-center pl-2 pr-2 rounded text-sm bg-white text-gray-800 dark:text-neutral-200 dark:bg-neutral-800">
                <TruncatedText text={job.company_details.description} length={120} />
              </span>
            )}
            { (job.company_details?.naf_ape?.activity || job.company_details?.naf_ape?.code) && (
              <span className="flex justify-center items-center pl-2 pr-2 rounded text-sm bg-white text-gray-800 dark:text-neutral-200 dark:bg-neutral-800">
                <TruncatedText text={job.company_details.naf_ape.activity || job.company_details.naf_ape.code || ''} length={35} />
              </span>
            )}
            { job.company_details?.website && (
              <span className="flex justify-center items-center pl-2 pr-2 rounded text-sm bg-white text-gray-800 dark:text-neutral-200 dark:bg-neutral-800">
                <a href={job.company_details.website} target="_blank" rel="noopener noreferrer">
                  {job.company_details.website}
                </a>
              </span>
            )}
          </div>

          <p className="mt-2 text-gray-500 dark:text-neutral-400">
            {job.description ? job.description : 'No description available.'}
          </p>

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