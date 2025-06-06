'use client';

import { IJobEntity } from "@/types/IJobEntity";
import { ReactElement } from "react";
import StatusDot from "./StatusDot";
import { INTEREST_OPTIONS, INTEREST_OPTIONS_LEGEND } from "@/constants/job-interest-status";

interface JobStatusProps {
  job: IJobEntity;
  size?: number; // size of the status dot in pixels
  showLegend?: boolean; // If true, display the legend with the status
}

export default function JobStatus({ job, size = 16, showLegend = false }: JobStatusProps) {

  const INTEREST_STATUS: Record<string, ReactElement> = {
    '✅': <StatusDot status="success" size={size} />,
    '🟢': <StatusDot status="success" size={size} />,
    '🟡': <StatusDot status="warning" size={size} />,
    '🔴': <StatusDot status="error" size={size} />,
  }
  
  const interestValue = INTEREST_OPTIONS.includes(job.interest_indicator || '') ? job.interest_indicator : '[N/A]';

  const render = (value: string | null) => {
    let legend: ReactElement = <>{INTEREST_OPTIONS_LEGEND['[N/A]']}</>

    for (const [key, legendValue] of Object.entries(INTEREST_OPTIONS_LEGEND)) {
      if (value && value === key && value !== '[N/A]') {
        legend = (
          <span className="flex items-center gap-1">
            {INTEREST_STATUS[key]}
            {showLegend ? legendValue : null}
          </span>
        );
        break;
      }
    }
    return legend;
  };

  return (
    <>
      {render(interestValue)}
    </>
  );
}