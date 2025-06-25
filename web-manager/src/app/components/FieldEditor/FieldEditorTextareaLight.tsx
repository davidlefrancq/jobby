'use client';

import { ChangeEvent, useEffect, useRef, useState } from "react";

interface FieldEditorTextareaLightProps {
  className?: string;
  initialValue: string | null | undefined;
  legendValue?: string;
  saveFunction?: (value: string) => void;
}

export default function FieldEditorTextareaLight({ className, initialValue, legendValue, saveFunction }: FieldEditorTextareaLightProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState<string | null | undefined>(initialValue);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setInputValue(e.target.value);
  };

  // Save when input value changes
  useEffect(() => {
    if (typeof saveFunction === 'function' && inputValue) saveFunction(inputValue)
  }, [inputValue]);

  // Reset input value when initialValue changes
  useEffect(() => {
    setInputValue(initialValue || null);
  }, [initialValue]);

  let style = "flex flex-wrap items-center gap-1 bg-blue-50 px-2 py-2 shadow-md";
  if (className) {
    style += ` ${className}`;
  }

  return (
    <div ref={ref} className={style}>
      <div className="text-sm text-gray-600 w-full">
        <textarea
          rows={3}
          cols={50}
          value={inputValue || ''}
          onChange={(e) => handleChange(e)}
          // className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          className="flex-1 w-full px-2 py-1 mr-1 border rounded text-sm focus:outline-none"
          placeholder={legendValue ? legendValue : "Description"}
        />
      </div>
    </div>
  );
}