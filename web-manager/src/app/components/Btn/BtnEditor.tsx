'use client';

import { motion } from 'framer-motion';
import { Eye, Pencil } from "lucide-react";

interface BtnEditorProps {
  isEditMode: boolean;
  onClick: () => void;
  className?: string;
  autoPositionning?: boolean;
}

export default function BtnEditor({ isEditMode, onClick, className, autoPositionning }: BtnEditorProps) {
  let styles = `cursor-pointer caret-transparent rounded-md text-neutral-400 transition-colors`;
  if (autoPositionning) styles += ' absolute top-2 right-2 p-1';
  if (className) styles += ` ${className}`;

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <motion.button
      onClick={handleClick}
      aria-label="Close"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.15, rotate: 180 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={styles}
    >
      {isEditMode ? <Pencil className="w-5 h-5 text-red-500 hover:text-red-700" /> : <Eye className="w-5 h-5 text-blue-500 hover:text-blue-700" />}
    </motion.button>
  );
}