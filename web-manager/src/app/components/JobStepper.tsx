import { useEffect, useState } from "react";
import { Stepper } from "./Stepper";
import { IStep, StepStatus } from "@/types/IStep";
import BtnLoading from "./Btn/BtnLoading";
import { RefreshCcw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { setIsStartedWorkflows } from "../store/n8nReducer";
import JobQueueUnrated from "./JobQueueUnrated";

export default function JobStepper() {
  const dispatch = useAppDispatch()
  const { isStartedWorkflows, franceTravailStatus, linkedInStatus } = useAppSelector(state => state.n8nReducer)
  const { unratedJobs } = useAppSelector(state => state.jobsReducer);

  const [currentStep, setCurrentStep] = useState(0);
  const [currentStatus, setCurrentStatus] = useState<StepStatus>("default");
  const [steps, setSteps] = useState<IStep[]>([
    { label: "Mails", status: "active" },
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

  const startEmailWorkflowsHandler = () => {
    if (!isStartedWorkflows) {
      dispatch(setIsStartedWorkflows(true));
    }
  }

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
    handleStepChange(currentStep + 1, "active");
  };

  useEffect(() => {
    if (franceTravailStatus === "success" && linkedInStatus === "success") {
      handleStepChange(0, "success");
      nextStep();
    } else if (franceTravailStatus === "error" || linkedInStatus === "error") {
      handleStepChange(0, "error");
    } else if (franceTravailStatus === "processing" || linkedInStatus === "processing") {
      handleStepChange(0, "processing");
    }
  }, [franceTravailStatus, linkedInStatus]);

  useEffect(() => {
    if (currentStep === 1) {
      if (unratedJobs.length === 0) {
        handleStepChange(currentStep, "success");
        nextStep();
      }
    }
  }, [unratedJobs]);

  const startStepProgress = () => {
    switch (currentStep) {
      case 0:
        if (!isStartedWorkflows) startEmailWorkflowsHandler();
        break;
      case 1:
        if (currentStatus !== "active") handleStepChange(currentStep, "processing");
      default:
        break;
    }
  };

  return (
    <div className="p-4">
      <div className="w-full bg-gray-100 p-4 rounded-lg shadow dark:bg-neutral-900">
        <Stepper steps={steps} />
      </div>

      {/* Steps Button */}
      <div className="mt-4 flex justify-between">
        {/* Previous button */}
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
          Previous
        </button>

        {/* Next button */}
        <button
          className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${currentStatus === "processing" || (currentStep >= steps.length - 1 && currentStatus !== "active") ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={startStepProgress}
          disabled={
            currentStatus === "processing"
            || (currentStep === steps.length - 1 && currentStatus !== "active")
            || currentStep > steps.length - 1
          }
        >
          Next
        </button>
      </div>
      
      {/* Unrated Management */}
      {currentStep === 1 && (
        <JobQueueUnrated />
      )}
    </div>
  );
}
