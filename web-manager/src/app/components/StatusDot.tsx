'use client';

import { motion } from 'framer-motion';
import React from 'react';

export type Status = 'error' | 'warning' | 'success';

interface StatusDotProps {
  status: Status;
  size?: number; // taille en pixels
}

const statusColorMap: Record<Status, string> = {
  error: 'bg-red-500',
  warning: 'bg-yellow-400',
  success: 'bg-green-500',
};


export default function StatusDot({ status, size = 16 }: StatusDotProps) {
  const colorClass = statusColorMap[status];

  return (
    <motion.div
      className={`rounded-full ${colorClass}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
}