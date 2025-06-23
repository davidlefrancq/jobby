'use client';

import { AlertCircle } from "lucide-react";
import { CloseButton } from "./Btn/CloseButton";
import { MessageType } from "@/types/MessageType";
import { StyleMapping } from "../lib/StyleMapping";
import Accordion from "./Acordion";
import { motion, AnimatePresence } from "framer-motion";

export interface IAlert {
  date: string
  message: string;
  stack?: string;
  type: MessageType;
}

interface IAlertItemProps {
  alert: IAlert;
  onRemove: (error: IAlert) => void;  
}

export default function AlertMessage({ alert, onRemove }: IAlertItemProps) {
  const { date, message, type } = alert;

  // Get styles based on the alert type
  const styles = StyleMapping.getStyles(type);
  if (!styles) return null;

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={alert.date}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className={`w-full max-w-2xl mx-auto mb-1 ${styles.bg} ${styles.text} rounded-lg gap-3 shadow-md `}>
            <div className={`w-full max-w-2xl mx-auto px-4 py-3 flex items-start justify-between gap-3 relative`}>
              <div className="flex flex-1 items-start gap-3">
                <AlertCircle className={`w-5 h-5 mt-0 ${styles.iconColor}`} />
                <div className="text-sm font-medium">{message}</div>
              </div>

              <div className="flex mt-0.5 mr-6">
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(date).toLocaleString()}
                </span>
              </div>
              <CloseButton className={`border ${styles.border} ${styles.text} ${styles.hoverBg}`} onClick={() => onRemove(alert)} />
            </div>

            {alert.stack && <div className={`mb-3 ${styles.border} ${styles.bg} rounded-lg`}>
              <Accordion>
                <div className={`${styles.text} text-sm`}>
                  {alert.stack ? alert.stack : 'No stack trace available.'}
                </div>
              </Accordion>
            </div>}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}