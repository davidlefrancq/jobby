'use client';

import { useEffect, useRef, useState } from "react";
import Toggle from "../Toggle";

interface FieldEditorBoolLightProps {
  className?: string;
  initialValue?: boolean;
  legendValue?: string;
  saveFunction?: (value: boolean) => void;
}

export default function FieldEditorBoolLight ({ className, initialValue, legendValue, saveFunction }: FieldEditorBoolLightProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [value, setValue] = useState(initialValue || false);

  // Save when toggle switch
  useEffect(() => {
    if (typeof saveFunction === 'function') saveFunction(value);
  }, [value]);

  // Reset value when initialValue changes
  useEffect(() => {
    setValue(initialValue || false);
  }, [initialValue]);

  let style = "flex items-center bg-blue-50 px-2 py-2 shadow-md";
  if (className) {
    style += ` ${className}`;
  }

  // Form editor for teleworking
  return (
    <div ref={ref} className={style}>
      {/* Toggle Switch */}
      <Toggle checked={value} onChange={(value: boolean) => setValue(value)} />

      {/* Legend */}
      {legendValue && <div className="ml-2 text-sm text-gray-600 w-full">
        {legendValue}
      </div>}
    </div>
  );
}