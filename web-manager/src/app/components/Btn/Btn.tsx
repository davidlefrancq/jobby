'use client';

import { CSSProperties } from "react";

interface BtnProps {
  title: string | React.ReactNode;
  isActive: boolean;
  width?: string;
  height?: string;
  rounded?: 'rounded-sm' | 'rounded-md' | 'rounded-lg' | 'rounded-xl' | 'rounded-full';
  onClick: () => void;
}

export default function Btn({
  title,
  isActive,
  width = '150px',
  height = '40px',
  rounded = 'rounded-full',
  onClick }: BtnProps
) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClick();
  }

  let btnClassName = "text-white text-center items-center focus:ring-4 font-medium text-sm px-2.5 py-2.5 focus:outline-none caret-transparent";
  btnClassName += ` ${rounded} transition-all duration-200 ease-in-out`;
  if (isActive) {
    btnClassName += " bg-blue-700 cursor-not-allowed";
  } else {
    btnClassName += " bg-blue-500 hover:bg-blue-600 focus:ring-blue-300 cursor-pointer";
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