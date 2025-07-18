import { IJobEntity } from "@/types/IJobEntity";
import { useAppDispatch, useAppSelector } from "../store";
import { clearCvs, setCvs, setCvsSkip, setSelectedCvId } from "../store/cvsReducer";
import { useEffect, useState } from "react";
import { RepositoryFactory } from "../dal/RepositoryFactory";
import { addAlert } from "../store/alertsReducer";
import { ICvEntity } from "@/types/ICvEntity";
import { updateDislikedJob, updateLikedJob, setJobSelected } from "../store/jobsReducer";
import Btn from "./Btn/Btn";
import { Trash2 } from "lucide-react";

interface JobLinkCvProps {
  job: IJobEntity;
}

let isFisrtLoad = true;
const cvRepository = RepositoryFactory.getInstance().getCvRepository();
const jobRepository = RepositoryFactory.getInstance().getJobRepository();

export default function JobLinkCv({ job }: JobLinkCvProps) {
  const dispatch = useAppDispatch();
  const { cvs, cvsLimit, cvsSkip, selectedCvId } = useAppSelector(state => state.cvsReducer);

  const [inLoading, setInLoading] = useState(false);
  
  const handleSelect = (cv: ICvEntity) => {
    if (cv._id && job._id) {
      jobRepository.update(job._id.toString(), { cv_id: cv._id.toString() })
        .then((data) => {
          if (cv._id) dispatch(setSelectedCvId(cv._id.toString()));
          if (data && data.preference === 'like') dispatch(updateLikedJob(data));
          else if (data && data.preference === 'dislike') dispatch(updateDislikedJob(data));
          dispatch(setJobSelected(data));
        })
        .catch(err => {
          dispatch(addAlert({
            date: new Date().toISOString(),
            message: `Failed to link CV to job: ${err.message}`,
            type: 'error',
          }));
        });
    }
  }

  const handleRemove = () => {
    if (job._id) {
      jobRepository.update(job._id.toString(), { cv_id: null })
        .then((data) => {
          if (data && data.preference === 'like') dispatch(updateLikedJob(data))
          else if (data && data.preference === 'dislike') dispatch(updateDislikedJob(data))
          dispatch(setJobSelected(data));
          dispatch(setSelectedCvId(null));
        })
        .catch(err => {
          dispatch(addAlert({
            date: new Date().toISOString(),
            message: `Failed to remove CV from job: ${err.message}`,
            type: 'error',
          }));
        });
    }
  };

  const loadCvs = async () => {
    const data = await cvRepository.getAll(cvsLimit, cvsSkip);
    if (data) {
      let newCvList = cvs.filter(cv => !data.some(newCv => newCv._id === cv._id));
      newCvList = [...newCvList, ...data];
      dispatch(setCvs(newCvList));
      dispatch(setCvsSkip(cvsSkip + data.length));
      if (data.length < cvsLimit) {
        setInLoading(false);
      } else {
        await loadCvs();
      }
    }
  };

  useEffect(() => {
    if (isFisrtLoad) {
      isFisrtLoad = false;
      setInLoading(true);
      if (job.cv_id) dispatch(setSelectedCvId(job.cv_id));
      // Load CVs when the component mounts
      dispatch(clearCvs());
      loadCvs().then(() => {
        setInLoading(false);
      }).catch(err => {
        dispatch(addAlert({
          date: new Date().toISOString(),
          message: `Failed to load CVs: ${String(err)}`,
          type: 'error',
        }));
        setInLoading(false);
      });
    }
    
    return () => {
      // Clear CVs when the component unmounts
      dispatch(clearCvs());
    };
  }, [])

  const cvsList = cvs.filter(cv => cv._id && (cv._id.toString() !== selectedCvId && cv._id.toString() !== job.cv_id));
  const selectedCv = cvs.find(cv => cv._id && (cv._id.toString() === selectedCvId || cv._id.toString() === job.cv_id));

  return (
    <div>
      {/* Selected CV */}
      {selectedCv && (
        <div className="mb-2 text-sm text-gray-700 flex items-center">
          <span className="mr-1 font-bold">CV épinglé:</span>
          <span className="mr-1">{selectedCv.title}</span>
          <Btn isActive={false} title={<Trash2 size={18} />} onClick={() => handleRemove()} type="danger" width="40px" />
        </div>
      )}
      {/* Liste of CVs */}
      {!selectedCv && cvsList.length > 0 && (
        <div className="mb-2 text-sm text-gray-700">
          <span className="min-w-30 mt-0 mb-auto py-2.5 mr-1 font-bold">Selectionne un CV:</span>
        </div>
      )}
      {!selectedCv && cvsList.map(cv => (
        cv._id && (
          <div key={cv._id.toString()} className="mb-2">
            <Btn isActive={cv._id.toString() === selectedCvId} title={cv.title} onClick={() => handleSelect(cv)} width={`${cv.title.length*10}px`}/>
          </div>
        )
      ))}
      {inLoading && <div className="text-gray-500">Loading CVs...</div>}
      {!inLoading && cvs.length === 0 && <div className="text-gray-500">No CVs available.</div>}
    </div>
  );
}