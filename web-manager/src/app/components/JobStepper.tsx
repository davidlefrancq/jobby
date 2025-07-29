import { useEffect, useState } from "react";
import { Stepper } from "./Stepper";
import { IStep } from "@/types/IStep";
import { IJobEntity } from "@/types/IJobEntity";

interface JobStepperProps {
  job: IJobEntity;
}

export default function JobStepper({ job }: JobStepperProps) {
  const [steps, setSteps] = useState<IStep[]>([
    { label: "SIREN", status: "default" },
    { label: "CV", status: "default" },
    { label: "Letter", status: "default" },
    { label: "Email", status: "default" },
  ]);

  const handleStepChange = (index: number, status: "default" | "active" | "success" | "error" | "processing") => {
    const updatedSteps = { ...steps[index], status };
    setSteps((prevSteps) =>
      prevSteps.map((step, i) => (i === index ? updatedSteps : step))
    );
  };

  useEffect(() => {
    if (job.company_details?.siren) {
      handleStepChange(0, "success");
    }
    if (job.cv_id) {
      handleStepChange(1, "success");
    }
    if (job.motivation_letter) {
      handleStepChange(2, "success");
    }
    if (job.motivation_email) {
      handleStepChange(3, "success");
    }
  }, [job]);

  return (
    <div className="p-4">
      <div className="flex items-center text-center w-full bg-gray-100 p-4 rounded-lg shadow dark:bg-neutral-900">
        
        {/* Stepper progress bar */}
        <div className="flex items-center justify-center flex-1 ps-4 pe-4">
          <Stepper steps={steps} />
        </div>
        
      </div>
    </div>
  );
}
