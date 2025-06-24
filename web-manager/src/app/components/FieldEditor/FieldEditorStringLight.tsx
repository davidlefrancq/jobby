'use client';

import { useEffect, useRef, useState } from "react";

interface FieldEditorStringLightProps {
  className?: string;
  initialValue: string | null | undefined;
  legendValue?: string;
  saveFunction?: (value: string) => void;
}

export default function FieldEditorStringLight({ className, initialValue, legendValue, saveFunction }: FieldEditorStringLightProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState<string | null | undefined>(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  let style = "flex flex-wrap items-center gap-1 bg-blue-50 px-2 py-2 max-w-xl shadow-md";
  if (className) {
    style += ` ${className}`;
  }

  return (
    <div ref={ref} className={style}>
      <div className="text-sm text-gray-600 w-full">
        <input
          type="text"
          value={inputValue || ''}
          onChange={handleChange}
          className="flex-1 w-[80%] px-2 py-1 mr-1 border rounded text-sm focus:outline-none"
          placeholder={legendValue ? legendValue : "Enter value"}
        />
      </div>
    </div>
  );
}