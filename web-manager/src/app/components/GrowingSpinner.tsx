'use client';

export function GrowingSpinner() {
  return (
    <div className="flex items-center">
      <div className="w-4 h-4 rounded-full bg-blue-600 pulse-grow" />
    </div>
  );
}