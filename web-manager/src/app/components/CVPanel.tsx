import { useEffect, useRef, useState } from "react";
import { RepositoryFactory } from "../dal/RepositoryFactory";
import { useAppDispatch, useAppSelector } from "../store";
import { clearCvs, removeCv, setCvs, setCvsCounter, setCvsLimit, setCvsSkip, setSelectedCvId, updateCv } from "../store/cvsReducer";
import { addAlert } from "../store/alertsReducer";
import { MessageType } from "@/types/MessageType";
import { ICvEntity } from "@/types/ICvEntity";
import DisplayBanner from "./DisplayBanner";

const cvRepository = RepositoryFactory.getInstance().getCvRepository();

let firstLoad = true;

export default function CVPanel() {
  const dispatch = useAppDispatch()
  const { cvs, cvsCounter, cvsLimit, cvsSkip, selectedCvId } = useAppSelector(state => state.cvsReducer)

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const addCvs = (newCvs: ICvEntity[]) => {
    // Cvs filtered without newCvs
    const filteredCvs = cvs.filter(cv => !newCvs.some(newCv => newCv._id === cv._id));
    // Persist in the store
    dispatch(setCvs([...filteredCvs, ...newCvs]));
    dispatch(setCvsSkip(cvsSkip + newCvs.length));
    // Disable the loader if there are no more cvs from load
    if (newCvs.length < cvsLimit) {
      setHasMore(false);
    }
  }

  const loadCvs = async () => {
    if (!isFetching) {
      setIsFetching(true);
      try {
        const data = await cvRepository.getAll(cvsLimit, cvsSkip)
        if (data && data.length > 0) {
          addCvs(data);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        if (err && (err as Error).message) handleAddError((err as Error).message, 'error');
        else handleAddError(String(err), 'error');
      } finally {
        setIsFetching(false);
      }
    }
  }

  const loadCvsCounter = () => {
    cvRepository.count().then(count => {
      if (count >= 0) {
        dispatch(setCvsCounter(count));
      } else {
        handleAddError('Failed to load CVs counter.', 'error');
      }
    }).catch(err => {
      handleAddError(err.message, 'error');
    })
  }

  const handleAddError = (message: string, type: MessageType) => {
    const errorMessage = {
      date: new Date().toISOString(),
      message,
      type,
    };
    dispatch(addAlert(errorMessage));
  }

  // Load the first batch of cvs
  useEffect(() => {
    if (firstLoad) {
      firstLoad = false;
      loadCvs().then(() => {}).catch(err => {
        handleAddError(err.message, 'error');
      });
      loadCvsCounter();
    }
  }, []);

  // Load more cvs
  useEffect(() => {
    if (!loaderRef.current || !hasMore || isFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setIsFetching(true);
          loadCvs().then(() => {
            setIsFetching(false);
          }).catch(err => {
            handleAddError(err.message, 'error');
            setIsFetching(false);
          });
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, isFetching, cvsLimit, cvsSkip]);

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-2">CV Panel</h2>
      <DisplayBanner value={`${cvs.length}/${cvsCounter} CVs`} />
      {/* <p>{cv.title || '—'}</p> */}
      {/* <p>{cv.created_at ? cv.created_at.toLocaleString() : null}</p> */}

      {/* Tu peux ajouter d'autres champs ici en lecture seule */}

      <div ref={loaderRef} className="h-10"></div>
      <div className="text-center text-sm text-gray-400 mt-2 mb-6">
        {!hasMore && "No more liked cv."}
        {isFetching && hasMore && "Loading..."}
      </div>
    </div>
  );
}
