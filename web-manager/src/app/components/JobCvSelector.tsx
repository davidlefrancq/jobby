import { IJobEntity } from "@/types/IJobEntity";
import { useAppDispatch, useAppSelector } from "../store";
import { useEffect, useRef, useState } from "react";
import { RepositoryFactory } from "../dal/RepositoryFactory";
import { addAlert } from "../store/alertsReducer";
import { updateDislikedJob, updateLikedJob, updateUnratedJob } from "../store/jobsReducer";
import { setCvs, setCvsCounter, setCvsHasMore, setCvsInLoading } from "../store/cvsReducer";
import { CvSorter } from "@/backend/lib/CvSorter";

const cvRepository = RepositoryFactory.getInstance().getCvRepository();
const jobRepository = RepositoryFactory.getInstance().getJobRepository();

interface JobCvSelectorProps {
  job: IJobEntity;
}

export default function JobCvSelector({ job }: JobCvSelectorProps) {
  const dispatch = useAppDispatch()
  const { cvs, cvsCounter, cvsLimit, cvsSkip, selectedCvId, cvsHasMore, cvsInLoading } = useAppSelector(state => state.cvsReducer)

  const [ cvSelected, setCvSelected ] = useState<string | null>(job.cv_id || null);
  const [ inUpdating, setInUpdating ] = useState(false);

  const firstLoad = useRef(true);

  const handleJobUpdate = () => {
    if (!inUpdating && cvSelected && job._id) {
      console.log('Updating job CV:', job._id, 'with CV:', cvSelected);
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
        console.error('Error updating job CV:', err);
        setCvSelected(job.cv_id || null); // Reset to previous CV if update fails
      });
    }
  }

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

  const loadCvs = async () => {
    if (cvsInLoading || !cvsHasMore) return; // Prevent multiple fetches

    // setIsLoading(true);
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

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      loadCvsConter();
      loadCvs();
    }
  }, []);
  
  useEffect(() => {
    handleJobUpdate();
  }, [cvSelected]);

  return (
    <>
      <select
        className=""
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

      {cvsInLoading && (
        <div className="text-center text-gray-500 dark:text-neutral-400">
          Loading CVs...
        </div>
      )}
    </>
  );
}