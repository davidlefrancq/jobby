'use client';

import { ChangeEvent, useEffect, useRef, useState } from "react";

interface FieldEditorDateLightProps {
  className?: string;
  initialValue: Date | null | undefined;
  legendValue?: string;
  saveFunction?: (value: Date) => void;
}

export default function FieldEditorDateLight({ className, initialValue, legendValue, saveFunction }: FieldEditorDateLightProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState<Date | null | undefined>(initialValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const dateValue = e.target.value ? new Date(e.target.value) : null;
    setInputValue(dateValue);
  };

  // Save when input value changes
  useEffect(() => {
    if (typeof saveFunction === 'function' && inputValue) saveFunction(inputValue)
  }, [inputValue]);

  // Reset input value when initialValue changes
  useEffect(() => {
    setInputValue(initialValue || null);
  }, [initialValue]);

  let style = "flex flex-wrap items-center gap-1 bg-blue-50 px-2 py-2 max-w-xl shadow-md";
  if (className) {
    style += ` ${className}`;
  }

  return (
    <div ref={ref} className={style}>
      <div className="text-sm text-gray-600 w-full">
        <input
          type="date"
          value={inputValue ? inputValue.toISOString().split('T')[0] : ''}
          onChange={(e) => handleChange(e)}
          className="flex-1 w-[80%] px-2 py-1 mr-1 border rounded text-sm focus:outline-none"
          placeholder={legendValue ? legendValue : "Description"}
        />
      </div>
    </div>
  );
}