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

const jobRepository = RepositoryFactory.getInstance().getJobRepository();
const n8nWorkflow = N8NWorkflow.getInstance();

interface JobMotivationLetterProps {
  job: IJobEntity;
}

export default function JobMotivationLetter({ job }: JobMotivationLetterProps) {
  const dispatch = useAppDispatch();

  const [motivationLetter, setMotivationLetter] = useState<string | null>(job.motivation_letter || null);
  const [inGenerateMotivationLetter, setInGenerateMotivationLetter] = useState(false);
  const [inGenerateMotivationLetterDateStart, setInGenerateMotivationLetterDateStart] = useState<Date | null>(null);
  const [inGenerateMotivationLetterDateEnd, setInGenerateMotivationLetterDateEnd] = useState<Date | null>(null);
  const [executionTimeCounter, setExecutionTimeCounter] = useState(0);
  const [inSaveMotivationLetter, setInSaveMotivationLetter] = useState(false);

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
   * FR: Générer une lettre de motivation pour le job en cours
   * EN: Generate a motivation letter for the current job
   */
  const generateMotivationLetterHandler = async () => {
    if (inGenerateMotivationLetter) return; // Prevent multiple clicks
    setInGenerateMotivationLetter(true);
    setInGenerateMotivationLetterDateStart(new Date());
    setInGenerateMotivationLetterDateEnd(null);

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

      const response = await n8nWorkflow.startCVMotivationLetterWorkflow({ jobId, cvId });
      if (response.error) {
        handleAddError(`Failed to generate motivation letter: ${response.error}`, 'error');
      } else {
        dispatch(addNotification({
          id: Date.now(),
          message: `Motivation letter generated for job ${jobId}`,
        }));
        // Reload the job to reflect the changes
        const updatedJob = await jobRepository.getById(jobId);
        if (updatedJob) {
          if (updatedJob.preference === 'dislike') dispatch(updateDislikedJob(updatedJob));
          else if (updatedJob.preference === 'like') dispatch(updateLikedJob(updatedJob));
          else if (!updatedJob.preference) dispatch(updateUnratedJob(updatedJob));
        } else {
          handleAddError(`Failed to retrieve updated job after motivation letter generation: ${String(jobId)}`, 'error');
        }
      }
    } catch (err) {
      handleAddError(`Failed to start motivation letter workflow: ${String(err)}`, 'error');
    } finally {
      setInGenerateMotivationLetter(false);
      setInGenerateMotivationLetterDateEnd(new Date());
    }
  }

  /**
   * FR: Enregistre la lettre de motivation dans le job
   * EN: Saves the motivation letter in the job
   */
  const saveMotivationLetterHandler = async () => {
    if (inSaveMotivationLetter) return; // Prevent multiple clicks
    setInSaveMotivationLetter(true);

    try {
      // FR: Vérifier si la lettre de motivation a changé
      // EN: Check if the motivation letter has changed
      const jobId = job._id?.toString();
      if (!jobId) {
        handleAddError("Job ID is not defined.", 'error');
        return;
      }

      // FR: Si la lettre de motivation n'a pas changé, ne rien faire
      // EN: If the motivation letter has not changed, do nothing
      if (motivationLetter === job.motivation_letter) {
        handleAddError("No changes detected in the motivation letter.", 'warning');
        return;
      }

      // FR: sauvegarder la lettre de motivation dans le job
      // EN: Save the motivation letter in the job
      const motivation_letter = motivationLetter?.trim() || null;
      const updatedJob = await jobRepository.update(jobId, { motivation_letter });
      if (updatedJob) {
        dispatch(updateLikedJob(updatedJob));
        dispatch(addNotification({
          id: Date.now(),
          message: `Motivation letter saved for job ${jobId}`,
        }));
      } else {
        handleAddError(`Failed to save motivation letter for job: ${String(jobId)}`, 'error');
      }
    } catch (err) {
      handleAddError(`Failed to save motivation letter: ${String(err)}`, 'error');
    } finally {
      setInSaveMotivationLetter(false);
    }
  }

  /**
   * FR: Formate la durée en HH:MM:SS
   * EN: Formats the duration into HH:MM:SS
   */
  function formatDuration(totalSeconds: number): string {
    // FR: Définir les durées en secondes pour chaque unité de temps
    // EN: Define the durations in seconds for each time unit
    const secondsInHour = 3600;
    const secondsInMinute = 60;

    let remainingSeconds = totalSeconds;

    // FR: Calculer les heures, minutes et secondes restantes
    // EN: Calculate the remaining hours, minutes, and seconds
    const hours = Math.floor(remainingSeconds / secondsInHour);
    remainingSeconds %= secondsInHour;
    const minutes = Math.floor(remainingSeconds / secondsInMinute);
    const seconds = Math.floor(remainingSeconds % secondsInMinute);

    // FR: Formater les heures, minutes et secondes en HH:MM:SS
    // EN: Format the hours, minutes, and seconds into HH:MM:SS
    const timeString = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    // FR: Retourner la chaîne formatée
    // EN: Return the formatted string
    return timeString;
  }

  /**
   * FR: Met à jour le compteur d'exécution
   * EN: Updates the execution time counter
   */
  useEffect(() => {
    // FR: Si la date de début n'est pas définie ou si la date de fin est définie, ne rien faire
    // EN: If the start date is not set or the end date is set, do nothing
    if (!inGenerateMotivationLetterDateStart || inGenerateMotivationLetterDateEnd) return;

    // FR: Mettre à jour le compteur d'exécution toutes les secondes
    // EN: Update the execution time counter every second
    const interval = setInterval(() => {
      const endTime = new Date();
      const duration = (endTime.getTime() - inGenerateMotivationLetterDateStart.getTime()) / 1000;
      setExecutionTimeCounter(duration);
    }, 1000);

    // FR: Nettoyer l'intervalle lorsque le composant est démonté ou que les dates changent
    // EN: Clean up the interval when the component unmounts or the dates change
    return () => {
      clearInterval(interval);
    };
  }, [inGenerateMotivationLetterDateStart, inGenerateMotivationLetterDateEnd]);

  /**
   * FR: Met à jour la lettre de motivation lorsque le job change
   * EN: Updates the motivation letter when the job changes
   */
  useEffect(() => {
    setMotivationLetter(job.motivation_letter || null);
  }, [job.motivation_letter]);

  return (
    <div className="flex flex-col gap-2">
      {/* Textarea for edit job.motivation_letter */}
      <textarea
        className="w-full h-[100px] p-2 border border-gray-300 rounded-md dark:bg-neutral-800 dark:border-neutral-700"
        placeholder="Edit motivation letter here..."
        value={motivationLetter || ''}
        onChange={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setMotivationLetter(e.target.value);
        }}
      />

      <div className="w-full flex grid-cols-4 items-start justify-end gap-2">

        {/* Show generation time if inGenerateMotivationLetterDateStart is set */}
        {inGenerateMotivationLetterDateStart && (
          <div className="w-[25%] col-span-1 text-sm text-gray-500 dark:text-neutral-400">
            <div className="grid grid-row-2 gap-1 items-start justify-start">
              <div className="col-span-1 font-semibold">Time start - end:</div>
              <div className="col-span-1">{inGenerateMotivationLetterDateStart.toLocaleTimeString()}
                {inGenerateMotivationLetterDateEnd && (
                  <> - {inGenerateMotivationLetterDateEnd.toLocaleTimeString()}</>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Generation total duration */}
        {inGenerateMotivationLetterDateStart && (
          <div className="w-[25%] col-span-1 text-sm text-gray-500 dark:text-neutral-400">
            <div className="grid grid-row-2 gap-1 items-start justify-start">
              <div className="col-span-1 font-semibold">Duration:</div>
              <div className="col-span-1">{formatDuration(Math.round(executionTimeCounter))}</div>
            </div>
          </div>
        )}

        <div className="w-[50%] col-span-2 flex items-center justify-end gap-2">
          {/* Button for generate letter from N8N Workflows */}
          <BtnLoading
            title={'Generate'}
            loading={inGenerateMotivationLetter} // Replace with actual loading state if needed
            onClick={generateMotivationLetterHandler}
            rounded="rounded-md"
            isDisabled={!job.cv_id} // Disable if no CV is selected
            // width="125px"
          />

          {/* BtnLoading for save textarea value if différente of job.motivation_letter */}
          <BtnLoading
            title="Save"
            loading={inSaveMotivationLetter} // Replace with actual loading state if needed
            onClick={saveMotivationLetterHandler}
            rounded="rounded-md"
            isDisabled={!motivationLetter || job.motivation_letter === motivationLetter} // Disable if no changes to the motivation letter
          />
        </div>
      </div>
    </div>
  );
}