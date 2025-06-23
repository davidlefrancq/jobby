'use client';

import { useEffect, useRef, useState } from "react";
import BtnSave from "../Btn/BtnSave";
import { X } from "lucide-react";
import { GrowingSpinner } from "../GrowingSpinner";
import FieldEditorErrorPanel from "./FieldEditorErrorPanel";
import TagList from "../TagList";

interface FieldEditorStringArrayProps {
  items: string[] | null | undefined;
  legendValue?: string;
  isEditMode: boolean;
  saveFunction?: (value: string[]) => Promise<void>;
}

export default function FieldEditorStringArray({ items, legendValue, isEditMode, saveFunction }: FieldEditorStringArrayProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [itemList, setItemList] = useState<string[]>(items || []);
  const [newTech, setNewTech] = useState<string>("");
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [inSavingProgress, setInSavingProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleremoveError = () => {
    setError(null);
  }

  const save = async () => {
    const loadingFinish = () => {
      setIsEditing(false);
      setInSavingProgress(false);
    };

    if (saveFunction && !inSavingProgress && isChanged()) {
      try {
        const value = itemList.sort((a, b) => a.localeCompare(b))
        await saveFunction(value);
      } catch (error) {
        let errorMessage = "An error occurred while saving new values.";
        if (error instanceof Error) errorMessage = error.message;
        else if (typeof error === "string") errorMessage = error;
        setError(errorMessage);
      } finally {
        loadingFinish();
      }
    } else {
      loadingFinish();
    }
  };


  const isChanged = (): boolean => {
    let result = false;
    const originalStingified = JSON.stringify(items || []);
    const newStringified = JSON.stringify(itemList);
    if (originalStingified !== newStringified) result = true;
    return result
  }

  const handleAddTech = () => {
    const trimmed = newTech.trim();
    if (
      trimmed &&
      !itemList.map(t => t.toLowerCase()).includes(trimmed.toLowerCase())
    ) {
      setItemList([...itemList, trimmed]);
    }
    setNewTech("");
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTech();
    } else if (e.key === 'Backspace' && newTech === '') {
      setItemList(prev => prev.slice(0, -1));
    }
  };

  const handleRemove = (index: number) => {
    setItemList(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsEditing(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsEditing(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isEditMode && isEditing) {
    return (
      <div ref={ref} className="flex flex-wrap items-center gap-1 bg-blue-50 px-2 py-2 max-w-xl shadow-md">
        <div className="text-sm text-gray-600 w-full">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 w-[80%] px-2 py-1 mr-1 border rounded text-sm focus:outline-none"
            placeholder={legendValue || "Add a value..."}
            value={newTech}
            onChange={(e) => setNewTech(e.target.value)}
            onKeyDown={handleKeyDownInput}
          />

          <button
            onClick={handleAddTech}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
            disabled={!newTech.trim()}
          >
            +
          </button>
          <FieldEditorErrorPanel message={error} close={handleremoveError} />
        </div>

        { itemList.length > 0 &&
          <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500 mt-2 mb-2 w-full">
            {itemList.map((item, idx) => (
              <span key={idx} className="bg-blue-200 text-blue-800 rounded-full px-3 py-1 text-sm flex items-center">
                {item}
                <button
                  onClick={() => handleRemove(idx)}
                  className="ml-1 hover:text-red-600"
                  aria-label={`Supprimer ${item}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        }
        
        <div className="text-xs text-gray-500 mb-2 w-full">
          <div className="flex justify-end gap-2">
            { !inSavingProgress && <BtnSave onClick={save} />}
            { inSavingProgress && <GrowingSpinner /> }
          </div>
        </div>

      </div>
    );
  }

  let className = '';
  if (isEditMode) className = 'cursor-pointer hover:text-blue-600';

  return (
    <div className="flex items-center">
      <span
        className={className}
        onClick={() => { if (isEditMode) setIsEditing(true); }}
      >
        <TagList tags={itemList} />
      </span>
    </div>
  );
}
