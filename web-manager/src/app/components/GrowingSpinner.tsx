'use client';

export function GrowingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-5 h-5 rounded-full bg-blue-600 pulse-grow" />
    </div>
  );
}