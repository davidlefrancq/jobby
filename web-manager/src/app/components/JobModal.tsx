import { IJobEntity } from "@/types/IJobEntity";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pencil, Eye } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import FieldEditorLevel from "./FieldEditorLevel";
import FieldEditorInterestIndicator from "./FieldEditorInterestIndicator";
import FieldEditorSalary from "./FieldEditorSalary";
import FieldEditorDescription from "./FieldEditorDescription";
import FieldEditorTeleworking from "./FieldEditorTeleworking";
import FieldEditorString from "./FieldEditorString";

interface JobModalProps {
  job: IJobEntity;
  onClose: () => void;
}

export default function JobModal({ job, onClose }: JobModalProps) {
  const [isEditMode, setIsEditMode] = useState(false);

  const handleToggleEdit = () => {
    setIsEditMode(prev => !prev);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh]"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Button Bar */}
          <div className="absolute top-4 right-4 flex items-center gap-3">
            {/* Edit Mode Button */}
            <button onClick={handleToggleEdit} className="text-gray-500 hover:text-black">
              {isEditMode ? <Pencil className="w-5 h-5 text-red-500" /> : <Eye className="w-5 h-5 text-blue-500" />}
            </button>
            
            {/* Close Button */}
            <button onClick={onClose} className="text-gray-500 hover:text-black">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            <FieldEditorString initialValue={job.title} isEditMode={isEditMode} legendValue={"Title"} />
          </h2>
          <p className="flex text-sm text-gray-500 mb-4">
            {/* Company */}
            <span className="py-2.5 mr-1">
              <FieldEditorString initialValue={job.company} isEditMode={isEditMode} legendValue={"Company name"} />
            </span>
            
            <span className="py-2.5 mr-1"> • </span>
            
            {/* Contract Type */}
            <span className="py-2.5 mr-1">
              <FieldEditorString initialValue={job.contract_type} isEditMode={isEditMode} legendValue={"Contract type"} />
            </span>
            
            <span className="py-2.5 mr-1"> • </span>
            
            {/* Location */}
            <span className="py-2.5 mr-1">
              <FieldEditorString initialValue={job.location} isEditMode={isEditMode} legendValue={"Location"} />
            </span>
          </p>

          {/* Description */}
          <div className="text-sm text-gray-700 whitespace-pre-line mb-6 text-justify">
            <FieldEditorDescription job={job} isEditMode={isEditMode} />
          </div>

          <div className="grid grid-cols-2 text-sm text-gray-600">
            <div>
              {/* Technologies */}
              <p className="flex items-center">
                <span className="py-2.5 mr-1"><strong>Technologies :</strong></span>
                {/* TODO: FieldEditorTechnologies */}
              </p>
              
              {/* Methodologies */}
              <p className="flex items-center">
                <span className="py-2.5 mr-1"><strong>Méthodologies :</strong></span>
                {/* TODO: FieldEditorMethodologies */}
              </p>
              
              {/* Teleworking */}
              <p className="flex items-center">
                <span className="py-2.5 mr-1"><strong>Télétravail :</strong></span>
                <FieldEditorTeleworking job={job} isEditMode={isEditMode} />
              </p>

              {/* Language */}
              <p className="flex items-center">
                <span className="py-2.5 mr-1"><strong>Langue :</strong></span>
                <FieldEditorString initialValue={job.language} isEditMode={isEditMode} />
              </p>
            </div>
            <div>
              {/* Level */}
              <p className="flex items-center">
                <span className="py-2.5 mr-1"><strong>Niveau :</strong></span>
                <FieldEditorLevel job={job} isEditMode={isEditMode} />
              </p>

              {/* Salary */}
              <p className="py-2.5">
                <span className="mr-1"><strong>Salaire :</strong></span>
                <FieldEditorSalary job={job} isEditMode={isEditMode} />
              </p>

              {/* Interest Indicator */}
              <p className="flex items-center">
                <span className="py-2.5 mr-1"><strong>Intérêt :</strong></span>
                <FieldEditorInterestIndicator job={job} isEditMode={isEditMode} />
              </p>

              {/* Source */}
              <p className="flex items-center">
                <span className="py-2.5 mr-1"><strong>Source :</strong></span>
                <Link href={job.source} target="_blank" className="text-blue-500 hover:underline">
                  {job.source ? new URL(job.source).hostname : "Lien non disponible"}
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}