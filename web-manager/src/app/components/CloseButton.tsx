'use client';

import { X } from "lucide-react";
import { motion } from 'framer-motion';

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
}

export function CloseButton({ onClick, className = '' }: CloseButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      aria-label="Fermer l’alerte"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.15, rotate: 90 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`cursor-pointer absolute top-2 right-2 p-1 rounded-md text-neutral-400 transition-colors ${className}`}
    >
      <X className="w-4 h-4" />
    </motion.button>
  );
}