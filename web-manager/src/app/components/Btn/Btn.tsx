'use client';

import { CSSProperties } from "react";

interface BtnProps {
  title: string | React.ReactNode;
  isActive: boolean;
  width?: string;
  height?: string;
  rounded?: 'rounded-sm' | 'rounded-md' | 'rounded-lg' | 'rounded-xl' | 'rounded-full';
  type?: 'success' | 'primary' | 'secondary' | 'danger' | 'warning';
  onClick: () => void;
}

export default function Btn({
  title,
  isActive,
  width = '150px',
  height = '40px',
  rounded = 'rounded-full',
  type = 'primary',
  onClick }: BtnProps
) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onClick();
  }

  let btnClassName = `text-white text-center items-center focus:ring-4 font-medium text-sm px-2.5 py-2.5 focus:outline-none caret-transparent ${rounded} transition-all duration-200 ease-in-out `;
  switch (type) {
    case 'success':
      btnClassName += isActive ? 'bg-green-700 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 focus:ring-green-300 cursor-pointer';
      break;
    case 'primary':
      btnClassName += isActive ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-300 cursor-pointer';
      break;
    case 'secondary':
      btnClassName += isActive ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-300 cursor-pointer';
      break;
    case 'danger':
      btnClassName += isActive ? 'bg-red-700 cursor-not-allowed' :  'bg-red-500 hover:bg-red-600 focus:ring-red-300 cursor-pointer';
      break;
    case 'warning':
      btnClassName += isActive ? 'bg-yellow-700 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-300 cursor-pointer';
      break;
    default:
      btnClassName += isActive ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-300 cursor-pointer';
      break;
  }

  const btnStyle: CSSProperties = {
    cursor: 'pointer',
    width,
    height,
    display: 'flex',
    justifyContent: 'center',
  }

  return (
    <button
      type="button"
      className={btnClassName}
      onClick={handleClick}
      style={btnStyle}
    >
      {title}
    </button>
  );
}