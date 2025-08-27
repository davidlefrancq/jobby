'use client';

import { CaptionsOff, CircleChevronDown, RouteOff } from "lucide-react";
import { GrowingSpinner } from "../GrowingSpinner";
import { JobWorkflowStatusType } from "@/app/interfaces/IJobStatus";

function ProcessingIcon() {
  return <div className="text-blue-500" title="Processing">
    <GrowingSpinner />
  </div>;
}

function OkIcon() {
  return <div className="text-green-500" title="Ok">
    <CircleChevronDown size={16} />
  </div>;
}

function ErrorIcon() {
  return <div className="text-red-500" title="Error">
    <CaptionsOff size={16} />
  </div>;
}

function SkippedIcon() {
  return <div className="text-gray-500" title="Skipped">
    <RouteOff size={16} />
  </div>;
}

export default function JobWorkflowStatusIcon({ status }: { status: JobWorkflowStatusType }) {
  switch (status) {
    case 'processing':
      return <ProcessingIcon />;
    case 'ok':
      return <OkIcon />;
    case 'error':
      return <ErrorIcon />;
    case 'skipped':
      return <SkippedIcon />;
    default:
      return null;
  }
}