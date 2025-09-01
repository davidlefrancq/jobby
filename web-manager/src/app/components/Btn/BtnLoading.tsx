'use client';

import { CSSProperties } from "react";
import { GrowingSpinner } from "../GrowingSpinner";

interface BtnLoadingProps {
  title: string | React.ReactNode;
  loading: boolean;
  width?: string;
  height?: string;
  color?: 'red' | 'blue' | 'green';
  rounded?: 'rounded-sm' | 'rounded-md' | 'rounded-lg' | 'rounded-xl' | 'rounded-full';
  isDisabled?: boolean;
  onClick: () => void;
}

export default function BtnLoading({
  title,
  loading,
  width = '150px',
  height = '40px',
  color = 'blue',
  rounded = 'rounded-full',
  isDisabled = false,
  onClick
}: BtnLoadingProps) {
  const handleClick = () => {
    if (!loading) {
      onClick();
    }
  }

  let btnClassName = ''
  const notAllowed = 'cursor-not-allowed';
  switch (true) {
    case isDisabled:
      btnClassName += notAllowed;
      break;
    case loading:
      btnClassName += notAllowed;
      break;
    default:
      btnClassName += ''
      break;
  }


  const btnStyle: CSSProperties = {
    width,
    height,
  }
  if (loading) {
    btnStyle.cursor = '';
  }

  return (
    <button
      type="button"
      className={`
        flex flex-row justify-center align-middle
        ${btnClassName}
        ${rounded}
        ${isDisabled
          ? `bg-gray-400 dark:bg-neutral-400`
          : color === 'red' 
            ? 'bg-red-500 hover:bg-red-800 focus:ring-red-300'
            : color === 'blue'
              ? 'bg-blue-500 hover:bg-blue-800 focus:ring-blue-300'
              : color === 'green' 
                ? 'bg-green-500 hover:bg-green-800 focus:ring-green-300'
                : ''
        }
        text-white text-center items-center
        hover:scale-[1.02] active:scale-95
      `}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!loading && !isDisabled) handleClick();
      }}
      style={btnStyle}
      disabled={loading || isDisabled}
    >
      {!loading ? title : <GrowingSpinner />}
    </button>
  );
}