import { useEffect, useState } from "react";
import { Stepper } from "./Stepper";
import { IStep, StepStatus } from "@/types/IStep";

export default function JobStepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentStatus, setCurrentStatus] = useState<StepStatus>("default");
  const [steps, setSteps] = useState<IStep[]>([
    { label: "Mails", status: "active" },
    { label: "Jobs", status: "default" },
    { label: "Like/Dislike", status: "default" },
    { label: "Enterprise", status: "default" },
    { label: "CV", status: "default" },
    { label: "Letter", status: "default" },
    { label: "Email", status: "default" },
    { label: "Gmail Draft", status: "default" },
  ]);

  useEffect(() => {
    let status: StepStatus = "default";
    if (currentStep <= steps.length - 1) status = steps[currentStep].status;
    if (status !== currentStatus) setCurrentStatus(status);
  }, [steps]);


  const handleStepChange = (index: number, status: "default" | "active" | "success" | "error" | "processing") => {
    setSteps((prevSteps) =>
      prevSteps.map((step, i) => (i === index ? { ...step, status } : step))
    );
  };

  const simulateStepProgress = () => {
    if (currentStatus === "active") {
      handleStepChange(currentStep, "processing");
      setTimeout(() => {
        handleStepChange(currentStep, "success");
        handleStepChange(currentStep + 1, "active");
        setCurrentStep((prev) => prev + 1);
      }, 1000); // Simulate a delay for processing 
    }
  };

  return (
    <div className="p-4">
      <div className="w-full bg-gray-100 p-4 rounded-lg shadow dark:bg-neutral-900">
        <Stepper steps={steps} />
      </div>
      <div className="mt-4 flex justify-between">
        <button
          className={`ml-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 ${currentStep === 0 || currentStatus === "processing" ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => {
            if (currentStep > 0) {
              handleStepChange(currentStep, "default");
              setCurrentStep(currentStep - 1);
              handleStepChange(currentStep - 1, "active");
            } else {
              handleStepChange(currentStep, "default");
            }
          }}
          disabled={currentStep === 0 || currentStatus === "processing"}
        >
          Rollback
        </button>
        <button
          className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${currentStatus === "processing" || (currentStep >= steps.length - 1 && currentStatus !== "active") ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={simulateStepProgress}
          // disabled={currentStatus === "processing" || currentStep >= steps.length - 1}
          disabled={currentStatus === "processing" || (currentStep === steps.length - 1 && currentStatus !== "active") || currentStep > steps.length - 1}
        >
          Start
        </button>
      </div>
    </div>
  );
}
