import { IJobEntity } from "@/types/IJobEntity";
import { RepositoryFactory } from "../dal/RepositoryFactory";
import { N8NWorkflow } from "../lib/N8NWorkflow";
import { useEffect, useState } from "react";
import BtnLoading from "./Btn/BtnLoading";
import { useAppDispatch } from "../store";
import { MessageType } from "@/types/MessageType";
import { addAlert } from "../store/alertsReducer";
import { updateDislikedJob, updateLikedJob, updateUnratedJob } from "../store/jobsReducer";
import { addNotification } from "../store/notificationsReducer";
import DatetimeTool from "../lib/DatetimeTool";

const jobRepository = RepositoryFactory.getInstance().getJobRepository();
const n8nWorkflow = N8NWorkflow.getInstance();

interface JobMotivationEmailProps {
  job: IJobEntity;
}

export default function JobMotivationEmail({ job }: JobMotivationEmailProps) {
  const dispatch = useAppDispatch();

  const [motivationEmail, setMotivationEmail] = useState<string | null>(job.motivation_email || null);
  const [inGenerateMotivationEmail, setInGenerateMotivationEmail] = useState(false);
  const [inGenerateMotivationEmailDateStart, setInGenerateMotivationEmailDateStart] = useState<Date | null>(null);
  const [inGenerateMotivationEmailDateEnd, setInGenerateMotivationEmailDateEnd] = useState<Date | null>(null);
  const [executionTimeCounter, setExecutionTimeCounter] = useState(0);
  const [inSaveMotivationEmail, setInSaveMotivationEmail] = useState(false);

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
   * FR: Générer un email de motivation pour le job en cours
   * EN: Generate a motivation email for the current job
   */
  const generateMotivationEmailHandler = async () => {
    if (inGenerateMotivationEmail) return; // Prevent multiple clicks
    setInGenerateMotivationEmail(true);
    setInGenerateMotivationEmailDateStart(new Date());
    setInGenerateMotivationEmailDateEnd(null);

    try {
      const jobId = job._id?.toString();
      const cvId = job.cv_id?.toString();

      // FR: Vérifier si jobId et cvId sont définis
      // EN: Check if jobId and cvId are defined
      if (!jobId || !cvId) {
        if (!jobId) handleAddError("Job ID is not defined.", 'error');
        if (!cvId) handleAddError("CV ID is not defined.", 'error');
        return;
      }

      const response = await n8nWorkflow.startCVMotivationEmailWorkflow({ jobId, cvId });
      if (response.error) {
        handleAddError(`Failed to generate motivation email: ${response.error}`, 'error');
      } else {
        dispatch(addNotification({
          id: Date.now(),
          message: `Motivation email generated for job ${jobId}`,
        }));
        // Reload the job to reflect the changes
        const updatedJob = await jobRepository.getById(jobId);
        if (updatedJob) {
          if (updatedJob.preference === 'dislike') dispatch(updateDislikedJob(updatedJob));
          else if (updatedJob.preference === 'like') dispatch(updateLikedJob(updatedJob));
          else if (!updatedJob.preference) dispatch(updateUnratedJob(updatedJob));
        } else {
          handleAddError(`Failed to retrieve updated job after motivation email generation: ${String(jobId)}`, 'error');
        }
      }
    } catch (err) {
      handleAddError(`Failed to start motivation email workflow: ${String(err)}`, 'error');
    } finally {
      setInGenerateMotivationEmail(false);
      setInGenerateMotivationEmailDateEnd(new Date());
    }
  }

  /**
   * FR: Enregistre la email de motivation dans le job
   * EN: Saves the motivation email in the job
   */
  const saveMotivationEmailHandler = async () => {
    if (inSaveMotivationEmail) return; // Prevent multiple clicks
    setInSaveMotivationEmail(true);

    try {
      // FR: Vérifier si la email de motivation a changé
      // EN: Check if the motivation email has changed
      const jobId = job._id?.toString();
      if (!jobId) {
        handleAddError("Job ID is not defined.", 'error');
        return;
      }

      // FR: Si l'email de motivation n'a pas changé, ne rien faire
      // EN: If the motivation email has not changed, do nothing
      if (motivationEmail === job.motivation_email) {
        handleAddError("No changes detected in the motivation email.", 'warning');
        return;
      }

      // FR: sauvegarder l'email de motivation dans le job
      // EN: Save the motivation email in the job
      const motivation_email = motivationEmail?.trim() || null;
      const updatedJob = await jobRepository.update(jobId, { motivation_email });
      if (updatedJob) {
        dispatch(updateLikedJob(updatedJob));
        dispatch(addNotification({
          id: Date.now(),
          message: `Motivation email saved for job ${jobId}`,
        }));
      } else {
        handleAddError(`Failed to save motivation email for job: ${String(jobId)}`, 'error');
      }
    } catch (err) {
      handleAddError(`Failed to save motivation email: ${String(err)}`, 'error');
    } finally {
      setInSaveMotivationEmail(false);
    }
  }

  /**
   * FR: Met à jour le compteur d'exécution
   * EN: Updates the execution time counter
   */
  useEffect(() => {
    // FR: Si la date de début n'est pas définie ou si la date de fin est définie, ne rien faire
    // EN: If the start date is not set or the end date is set, do nothing
    if (!inGenerateMotivationEmailDateStart || inGenerateMotivationEmailDateEnd) return;

    // FR: Mettre à jour le compteur d'exécution toutes les secondes
    // EN: Update the execution time counter every second
    const interval = setInterval(() => {
      const endTime = new Date();
      const duration = (endTime.getTime() - inGenerateMotivationEmailDateStart.getTime()) / 1000;
      setExecutionTimeCounter(duration);
    }, 1000);

    // FR: Nettoyer l'intervalle lorsque le composant est démonté ou que les dates changent
    // EN: Clean up the interval when the component unmounts or the dates change
    return () => {
      clearInterval(interval);
    };
  }, [inGenerateMotivationEmailDateStart, inGenerateMotivationEmailDateEnd]);

  /**
   * FR: Met à jour l'email de motivation lorsque le job change
   * EN: Updates the motivation email when the job changes
   */
  useEffect(() => {
    setMotivationEmail(job.motivation_email || null);
  }, [job.motivation_email]);

  return (
    <div className="flex flex-col gap-2">
      {/* Textarea for edit job.motivation_email */}
      <textarea
        className="w-full h-[100px] p-2 border border-gray-400 rounded-md dark:bg-neutral-800 dark:border-neutral-200"
        placeholder="Edit motivation email here..."
        value={motivationEmail || ''}
        onChange={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setMotivationEmail(e.target.value);
        }}
      />

      <div className="w-full flex grid-cols-4 items-start justify-end gap-2">

        {/* Show generation time if inGenerateMotivationEmailDateStart is set */}
        {inGenerateMotivationEmailDateStart && (
          <div className="w-[25%] col-span-1 text-sm text-gray-500 dark:text-neutral-400">
            <div className="grid grid-row-2 gap-2 items-start justify-start">
              <div className="col-span-1 font-semibold">Time start - end:</div>
              <div className="col-span-1">{inGenerateMotivationEmailDateStart.toLocaleTimeString()}
                {inGenerateMotivationEmailDateEnd && (
                  <> - {inGenerateMotivationEmailDateEnd.toLocaleTimeString()}</>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Generation total duration */}
        {inGenerateMotivationEmailDateStart && (
          <div className="w-[25%] col-span-1 text-sm text-gray-500 dark:text-neutral-400">
            <div className="grid grid-row-2 gap-2 items-start justify-start">
              <div className="col-span-1 font-semibold">Duration:</div>
              <div className="col-span-1">{DatetimeTool.formatDuration(Math.round(executionTimeCounter))}</div>
            </div>
          </div>
        )}

        <div className="w-[50%] col-span-2 flex items-center justify-end gap-2">
          {/* Button for generate email from N8N Workflows */}
          <BtnLoading
            title={'Generate'}
            loading={inGenerateMotivationEmail} // Replace with actual loading state if needed
            onClick={generateMotivationEmailHandler}
            rounded="rounded-md"
            isDisabled={!job.cv_id} // Disable if no CV is selected
            // width="125px"
          />

          {/* BtnLoading for save textarea value if different from job.motivation_email */}
          <BtnLoading
            title="Save"
            loading={inSaveMotivationEmail} // Replace with actual loading state if needed
            onClick={saveMotivationEmailHandler}
            rounded="rounded-md"
            isDisabled={!motivationEmail || job.motivation_email === motivationEmail} // Disable if no changes are made or motivationEmail is empty
          />
        </div>
      </div>
    </div>
  );
}