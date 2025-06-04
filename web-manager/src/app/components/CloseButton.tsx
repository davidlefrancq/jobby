'use client';

import { X } from "lucide-react";
import { motion } from 'framer-motion';

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
  autoPositionning?: boolean;
}

export function CloseButton({ onClick, className = '', autoPositionning = true }: CloseButtonProps) {
  let styles = `cursor-pointer rounded-md text-neutral-400 transition-colors caret-transparent`;
  if (autoPositionning) styles += ' absolute top-2 right-2 p-1';
  if (className) styles += ` ${className}`;

  return (
    <motion.button
      onClick={onClick}
      aria-label="Close"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.15, rotate: 90 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={styles}
    >
      <X className="w-5 h-5" />
    </motion.button>
  );
}