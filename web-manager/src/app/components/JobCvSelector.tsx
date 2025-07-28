import { IJobEntity } from "@/types/IJobEntity";
import { useAppDispatch, useAppSelector } from "../store";
import { useEffect, useRef, useState } from "react";
import { RepositoryFactory } from "../dal/RepositoryFactory";
import { addAlert } from "../store/alertsReducer";
import { updateDislikedJob, updateLikedJob, updateUnratedJob } from "../store/jobsReducer";
import { setCvs, setCvsCounter, setCvsHasMore, setCvsInLoading } from "../store/cvsReducer";
import { CvSorter } from "@/backend/lib/CvSorter";
import BtnLoading from "./Btn/BtnLoading";

const cvRepository = RepositoryFactory.getInstance().getCvRepository();
const jobRepository = RepositoryFactory.getInstance().getJobRepository();

interface JobCvSelectorProps {
  job: IJobEntity;
}

export default function JobCvSelector({ job }: JobCvSelectorProps) {
  const dispatch = useAppDispatch()
  const { cvs, cvsLimit, cvsSkip, cvsHasMore, cvsInLoading } = useAppSelector(state => state.cvsReducer)

  const [ cvSelected, setCvSelected ] = useState<string | null>(job.cv_id || null);
  const [ inUpdating, setInUpdating ] = useState(false);

  const firstLoad = useRef(true);

  /**
   * FR: Met à jour le CV associé à un job.
   * EN: Updates the CV associated with a job.
   */
  const handleJobUpdate = () => {
    if (!inUpdating && cvSelected && job._id) {
      setCvSelected(cvSelected);
      setInUpdating(true);
      jobRepository.update(job._id?.toString(), { cv_id: cvSelected }).then((data) => {
        if (data) {
          if (data.preference === 'like') {
            dispatch(updateLikedJob(data));
          } else if (data.preference === 'dislike') {
            dispatch(updateDislikedJob(data));
          } else {
            dispatch(updateUnratedJob(data));
          }
          setInUpdating(false);
        }
      }).catch(err => {
        dispatch(addAlert({
          date: new Date().toISOString(),
          type: 'error',
          message: `Failed to update job CV. Please try again. Error: ${String(err)}`,
        }));
        setCvSelected(job.cv_id || null); // Reset to previous CV if update fails
      });
    }
  }

  /**
   * FR: Chargement du compteur de CVs depuis le serveur.
   * EN: Loads the CVs counter from the server.
   */
  const loadCvsConter = () => {
    cvRepository.count()
      .then((counter) => {
        if (counter) {
          dispatch(setCvsCounter(counter));
        }
      })
      .catch((error) => {
        dispatch(addAlert({
          date: new Date().toISOString(),
          type: 'error',
          message: `Error loading CVs count: ${String(error)}`,
        }));
      });
  }

  /**
   * FR: Chargement des CVs avec pagination depuis le serveur et mise à jour de l'état.
   * EN: Loads CVs with pagination options from the server and updates the state.
   */
  const loadCvs = async () => {
    if (cvsInLoading || !cvsHasMore) return; // Prevent multiple fetches

    dispatch(setCvsInLoading(true));
    try {
      const data = await cvRepository.getAll(cvsLimit, cvsSkip);
      if (data && data.length > 0) {
        const cvsWithoutData = cvs.filter(cv => !data.some(newCv => newCv._id === cv._id));
        const newCvList = [...cvsWithoutData, ...data].sort(CvSorter.byUpdatedAt);
        dispatch(setCvs(newCvList));
        if (data.length < cvsLimit) {
          dispatch(setCvsHasMore(false));
        } else {
          await loadCvs();
        }
      }
    } catch (error) {
      console.error('Error loading CVs:', error);
    } finally {
      dispatch(setCvsInLoading(false));
    }
  }

  /**
   * FR: Chargement initial des CVs et du compteur.
   * EN: Initial loading of CVs and the counter.
   */
  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      loadCvsConter();
      loadCvs();
    }
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 bg-white dark:bg-neutral-900 rounded-md shadow-md">
      <select
        className="col-span-2 dark:bg-neutral-800 dark:text-neutral-200 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full"
        value={cvSelected || ''}
        onChange={(e) => {
          if (e.target.value !== cvSelected) {
            setCvSelected(e.target.value);
          }
        }}
      >
        <option value=""></option>
        {cvs.map((cv) => (
          <option
            key={cv._id?.toString()}
            value={cv._id?.toString()}
          >
            {cv.title || 'Unnamed CV'}
          </option>
        ))}
      </select>

      <BtnLoading
        loading={inUpdating}
        title={'Save'}
        onClick={handleJobUpdate}
        rounded="rounded-sm"
        isDisabled={!cvSelected || inUpdating || job.cv_id === cvSelected}
      />

      {cvsInLoading && (
        <div className="col-span-3 text-center text-gray-500 bg-amber-50 dark:text-neutral-400 dark:bg-neutral-800">
          Loading CVs...
        </div>
      )}
    </div>
  );
}