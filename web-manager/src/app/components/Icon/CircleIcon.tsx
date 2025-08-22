'use client';

export interface IconProps {
  size?: '2' | '4' | '6' | '10' | '12' | '14' | '24';
  color?: string;
}

export function CircleIcon({ size = '4', color = 'bg-gray-400' }: IconProps) {
  return (
    <div className={`w-${size} h-${size} rounded-full ${color} mr-1`}></div>
  );
}
