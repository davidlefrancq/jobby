'use client';

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface FieldEditorStringArrayLightProps {
  className?: string;
  items: string[] | null | undefined;
  legendValue?: string;
  saveFunction?: (value: string[]) => void;
}

export default function FieldEditorStringArrayLight({ className, items, legendValue, saveFunction }: FieldEditorStringArrayLightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [itemList, setItemList] = useState<string[]>(items || []);
  const [newTech, setNewTech] = useState<string>("");

  const handleAddTech = () => {
    try {
      const newTechList = newTech.split(',').map(t => t.trim()).filter(t => t);
      if (newTechList.length > 0) {
        const uniqueTechs = newTechList.filter(t => !itemList.map(i => i.toLowerCase()).includes(t.toLowerCase()));
        if (uniqueTechs.length > 0) {
          setItemList(prev => [...prev, ...uniqueTechs]);
        }
        setNewTech("");
        inputRef.current?.focus();
      }
    } catch (error) {
      console.error("Error adding technologies:", error);
    }
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTech();
    }
  };

  const handleRemove = (index: number) => {
    setItemList(prev => prev.filter((_, i) => i !== index));
  };

  // Save when itemList changes
  useEffect(() => {
    if (typeof saveFunction === 'function') saveFunction(itemList)
  }, [itemList]);

  // Reset itemList when items prop changes
  useEffect(() => {
    if (items) {
      setItemList(items);
      setNewTech("");
    } else {
      setItemList([]);
      setNewTech("");
    }
  }, [items]);

  let style = "flex flex-wrap items-center gap-2 bg-blue-50 px-2 py-2 shadow-md";
  if (className) {
    style += ` ${className}`;
  }

  return (
    <div ref={ref} className={style}>
      <div className="text-sm text-gray-600 w-full">
        <input
          ref={inputRef}
          type="text"
          className="flex-1 w-[85%] px-2 py-1 mr-1 border rounded text-sm focus:outline-none"
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
      </div>

      { itemList.length > 0 &&
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-2 mb-2 w-full">
          {itemList.map((item, idx) => (
            <span key={idx} className="text-sm bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm flex items-center">
              #{item}
              <button
                onClick={() => handleRemove(idx)}
                className="ml-1 text-red-400 hover:text-red-600 border-1 border-gray-200 hover:border-red-600 rounded-full cursor-pointer"
                aria-label={`Supprimer ${item}`}
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      }        
    </div>
  );
}
