'use client';

import { AlertCircle } from "lucide-react";
import { CloseButton } from "./CloseButton";
import { MessageType } from "@/types/MessageType";
import { StyleMapping } from "../lib/StyleMapping";

export interface IAlert {
  date: string
  message: string;
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
    <div className={`w-full max-w-2xl mx-auto ${styles.bg} ${styles.text} px-4 py-3 rounded-lg flex items-start justify-between gap-3 shadow-md relative`}>
      <div className="flex flex-1 items-start gap-3">
        <AlertCircle className={`w-5 h-5 mt-0.5 ${styles.iconColor}`} />
        <div className="text-sm font-medium">{message}</div>
      </div>
      <div className="flex mt-0.5 mr-6">
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {new Date(date).toLocaleString()}
        </span>
      </div>
      <CloseButton className={`border ${styles.border} ${styles.text} ${styles.hoverBg}`} onClick={() => onRemove(alert)} />
    </div>
  );
}