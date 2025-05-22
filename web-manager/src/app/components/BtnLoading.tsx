'use client';

import { CSSProperties } from "react";
import { GrowingSpinner } from "./GrowingSpinner";

interface BtnLoadingProps {
  title: string | React.ReactNode;
  loading: boolean;
  width?: string;
  onClick: () => void;
}

export default function BtnLoading({ title, loading, width = "150px", onClick }: BtnLoadingProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!loading) {
      e.preventDefault();
      onClick();
    }
  }

  let btnClassName = "text-white text-center items-center focus:ring-4 font-medium rounded-full text-sm px-2.5 py-2.5 focus:outline-none";
  if (loading) {
    btnClassName += " bg-blue-100 cursor-not-allowed";
  } else {
    btnClassName += " bg-blue-500 hover:bg-blue-600 focus:ring-blue-300";
  }

  const btnStyle: CSSProperties = {
    cursor: 'pointer',
    width: width,
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
  }
  if (loading) {
    btnStyle.cursor = '';
  }

  return (
    <button
      type="button"
      className={btnClassName}
      onClick={handleClick}
      style={btnStyle}
    >
      {!loading ? title : <GrowingSpinner />}
    </button>
  );
}