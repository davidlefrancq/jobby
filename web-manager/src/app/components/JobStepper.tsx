import { useEffect, useState } from "react";
import { Stepper } from "./Stepper";
import { IStep } from "@/types/IStep";
import { useAppDispatch, useAppSelector } from "../store";
import { setIsStartedWorkflows } from "../store/n8nReducer";
import JobQueueUnrated from "./JobQueueUnrated";
import JobExplorer from "./JobExplorer";
import N8NWorkflowPanel from "./N8NWorkflowPanel";

export default function JobStepper() {
  const dispatch = useAppDispatch()
  const { isStartedWorkflows, franceTravailStatus, linkedInStatus } = useAppSelector(state => state.n8nReducer)
  const { unratedCounter, unratedInLoading } = useAppSelector(state => state.jobsReducer);

  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<IStep[]>([
    { label: "Mails", status: "success" },
    { label: "Like/Dislike", status: "default" },
    { label: "Jobs", status: "default" },
    // { label: "CV", status: "default" },
    // { label: "Letter", status: "default" },
    // { label: "Email", status: "default" },
    // { label: "Gmail Draft", status: "default" },
  ]);

  const handleStepChange = (index: number, status: "default" | "active" | "success" | "error" | "processing") => {
    const updatedSteps = { ...steps[index], status };
    setSteps((prevSteps) =>
      prevSteps.map((step, i) => (i === index ? updatedSteps : step))
    );
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
    handleStepChange(currentStep + 1, "active");
  };

  const startEmailWorkflowsHandler = () => {
    if (!isStartedWorkflows) {
      dispatch(setIsStartedWorkflows(true));
    }
  }

  /* Step successful: go to next */
  useEffect(() => {
    const step = steps[currentStep];
    if (step.status === "success" && currentStep < steps.length) nextStep();
  }, [steps]);

  {/* Mails - update status */}
  useEffect(() => {
    if (franceTravailStatus === "error" || linkedInStatus === "error") handleStepChange(0, "error");
    else if (franceTravailStatus === "success" && linkedInStatus === "success") handleStepChange(0, "success");
    else if (isStartedWorkflows && (franceTravailStatus !== "success" || linkedInStatus !== "success")) handleStepChange(0, "processing");
  }, [isStartedWorkflows, franceTravailStatus, linkedInStatus]);

  {/* Like/Dislike - update status */}
  useEffect(() => {
    if (currentStep === 1) {
      if (steps[1].status === "default") {
        handleStepChange(1, 'processing');
      } 
      else if (!unratedInLoading && steps[1].status !== "processing") {
        handleStepChange(1, "active");
      }
    }
  }, [unratedInLoading, unratedCounter]);

  return (
    <div className="p-4">
      <div className="flex items-center text-center w-full bg-gray-100 p-4 rounded-lg shadow dark:bg-neutral-900">
        <Stepper steps={steps} />
      </div>

      {/* Steps Button */}
      <div className="mt-4 flex justify-between">
        {/* Previous button */}
        <button
          className={`ml-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 ${currentStep === 0 || steps[currentStep].status === "processing" ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => {
            if (currentStep > 0) {
              handleStepChange(currentStep, "default");
              setCurrentStep(currentStep - 1);
              handleStepChange(currentStep - 1, "active");
            } else {
              handleStepChange(currentStep, "default");
            }
          }}
          disabled={currentStep === 0 || steps[currentStep].status === "processing"}
        >
          Previous
        </button>

        {/* Start Button */}
        {currentStep === 0 && (
          <button
            className={`
              px-4
              py-2
              bg-blue-600
              text-white
              rounded
              hover:bg-blue-700
              ${steps[currentStep].status === "processing" || (currentStep >= steps.length - 1 && steps[currentStep].status !== "active") ? "opacity-50 cursor-not-allowed" : ""}
            `}
            onClick={() => startEmailWorkflowsHandler()}
            disabled={steps[0].status === "processing"}
          >
            {"Start"}
          </button>
        )}

        {/* Next Button */}
        {currentStep > 0 && (
          <button
            className={`
              px-4
              py-2
              bg-blue-600
              text-white
              rounded
              hover:bg-blue-700
              ${steps[currentStep].status === "processing" || (currentStep >= steps.length - 1 && steps[currentStep].status !== "active") ? "opacity-50 cursor-not-allowed" : ""}
            `}
            onClick={() => {
              handleStepChange(currentStep, "success");
            }}
            disabled={steps[currentStep].status === "processing" || (currentStep >= steps.length - 1 && steps[currentStep].status !== "active")}
          >
            {"Next"}
          </button>
        )}
      </div>

      {/* N8N Workflow Panel */}
      <div className={`p-8 ${currentStep === 0 ? "mt-4" : "hidden"} transition-all duration-300`}>
        <N8NWorkflowPanel />
      </div>

      {/* Unrated Management */}
      {currentStep === 1 && (<>
        <div className="flex justify-center mt-4">
          <JobQueueUnrated />
        </div>
        {/* Unrated conter */}
        {unratedCounter > 0 && (
          <div className="flex justify-center mt-4 text-gray-600 dark:text-neutral-400">
            {unratedCounter}
          </div>
        )}
      </>)}

      {/* Job Explorer */}
      { currentStep === 2 && (
        <div className="flex justify-center mt-4">
          <JobExplorer />
        </div>
      )}

    </div>
  );
}
