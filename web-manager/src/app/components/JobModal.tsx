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
import FieldEditorStringArray from "./FieldEditorStringArray";
import FieldEditorCompany from "./FieldEditorCompany";

interface JobModalProps {
  job: IJobEntity;
  onClose: () => void;
}

export default function JobModal({ job, onClose }: JobModalProps) {
  const [isEditMode, setIsEditMode] = useState(false);

  const handleToggleEdit = () => {
    setIsEditMode(prev => !prev);
  };

  const borderStyle = isEditMode ? " border border-red-500" : " border border-white";

  return (
    <AnimatePresence>
      <motion.div
        className={"fixed inset-0 z-50 flex items-center justify-center bg-black/50"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={"relative bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh]" + borderStyle}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Button Bar */}
          <div className={"absolute top-4 right-4 flex items-center gap-3"}>
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
          <div className="flex text-sm text-gray-500 mb-4">
            {/* Company */}
            <span className="py-2.5 mr-1">
              <FieldEditorCompany job={job} isEditMode={isEditMode} saveFunction={(values: Partial<IJobEntity>) => {
                return new Promise((resolve) => {
                  console.log({ values })
                  resolve();
                });
              }} />
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
          </div>

          {/* Description */}
          <div className="text-sm text-gray-700 whitespace-pre-line mb-6 text-justify">
            <FieldEditorDescription job={job} isEditMode={isEditMode} />
          </div>

          <div className="grid grid-cols-2 text-sm text-gray-600">
            <div className="pr-2">
              {/* Technologies */}
              <div className="">
                <span className="min-w-30 mt-0 mb-auto py-2.5 mr-1 font-bold">
                  Technologies :
                </span>
                <FieldEditorStringArray items={job.technologies} isEditMode={isEditMode} />
              </div>
              
              {/* Methodologies */}
              <div className="">
                <span className="min-w-30 mt-0 mb-auto py-2.5 mr-1 font-bold">
                  Méthodologies :
                </span>
                <FieldEditorStringArray items={job.methodologies} isEditMode={isEditMode} />
              </div>
              
              {/* Teleworking */}
              <div className="flex items-center">
                <span className="min-w-30 mt-0 mb-auto py-2.5 mr-1 font-bold">
                  Télétravail :
                </span>
                <FieldEditorTeleworking job={job} isEditMode={isEditMode} />
              </div>

              {/* Language */}
              <div className="flex items-center">
                <span className="min-w-30 mt-0 mb-auto py-2.5 mr-1 font-bold">
                  Langue :
                </span>
                <FieldEditorString initialValue={job.language} isEditMode={isEditMode} />
              </div>
            </div>
            <div>
              {/* Level */}
              <div className="flex items-center">
                <span className="min-w-15 mt-0 mb-auto py-2.5 mr-1 font-bold">
                  Niveau :
                </span>
                <FieldEditorLevel job={job} isEditMode={isEditMode} />
              </div>

              {/* Salary */}
              <div className="py-2.5">
                <span className="min-w-15 mt-0 mb-auto mr-1 font-bold">
                  Salaire :
                </span>
                <FieldEditorSalary job={job} isEditMode={isEditMode} />
              </div>

              {/* Interest Indicator */}
              <div className="flex items-center">
                <span className="min-w-15 mt-0 mb-auto py-2.5 mr-1 font-bold">
                  Intérêt :
                </span>
                <FieldEditorInterestIndicator job={job} isEditMode={isEditMode} />
              </div>

              {/* Source */}
              <div className="flex items-center">
                <span className="min-w-15 mt-0 mb-auto py-2.5 mr-1"><strong>Source :</strong></span>
                <Link href={job.source} target="_blank" className="text-blue-500 hover:underline">
                  {job.source ? new URL(job.source).hostname : "Lien non disponible"}
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}