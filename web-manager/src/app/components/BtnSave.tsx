'use client';

import { motion } from 'framer-motion';
import { Save } from 'lucide-react';

export default function BtnSave({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-xl shadow-md transition-colors cursor-pointer"
    >
      <Save className="w-4 h-4" />
      <span className="sr-only">Save</span>
    </motion.button>
  );
}
