import { useEffect, useState } from "react";
import { Stepper } from "./Stepper";
import { IStep } from "@/types/IStep";
import { useAppDispatch, useAppSelector } from "../store";
import { setIsStartedWorkflows, resetMainWorkflows } from "../store/n8nReducer";
import JobQueueUnrated from "./JobQueueUnrated";
import JobExplorer from "./JobExplorer";
import N8NWorkflowPanel from "./N8NWorkflowPanel";
import BtnLoading from "./Btn/BtnLoading";
import { CircleArrowLeft, CircleArrowRight, CircleChevronRight, CirclePlay } from "lucide-react";

export default function JobsStepper() {
  const dispatch = useAppDispatch()
  const { isStartedWorkflows, franceTravailStatus, linkedInStatus } = useAppSelector(state => state.n8nReducer)
  const { unratedCounter, unratedInLoading } = useAppSelector(state => state.jobsReducer);

  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<IStep[]>([
    { label: "Données", status: "active" },
    { label: "Évaluation", status: "default" }, // Like/Dislike
    { label: "Offres", status: "default" },
  ]);

  const handleStepChange = (index: number, status: "default" | "active" | "success" | "error" | "processing") => {
    const updatedSteps = { ...steps[index], status };
    setSteps((prevSteps) =>
      prevSteps.map((step, i) => (i === index ? updatedSteps : step))
    );
  };

  const nextStepHandler = () => {
    if (currentStep === 1 && unratedCounter === 0) handleStepChange(currentStep, "success");
    setCurrentStep(currentStep + 1);
    handleStepChange(currentStep + 1, "active");
  };

  const previousStepHandler = () => {
    handleStepChange(currentStep, "default");
    if (currentStep > 0) {
      if (currentStep === 1) {
        dispatch(setIsStartedWorkflows(false));
        dispatch(resetMainWorkflows());
      }
      setCurrentStep(currentStep - 1);
      handleStepChange(currentStep - 1, "active");
    }
  };

  const startEmailWorkflowsHandler = () => {
    if (!isStartedWorkflows) {
      dispatch(setIsStartedWorkflows(true));
    }
  }

  /* Step successful: go to next */
  useEffect(() => {
    const step = steps[currentStep];
    if (step.status === "success" && currentStep < steps.length - 1) nextStepHandler();
  }, [steps]);

  {/* Mails - update status */}
  useEffect(() => {
    if (franceTravailStatus === "error") handleStepChange(0, "error");
    else if (franceTravailStatus === "success") handleStepChange(0, "success");
    else if (isStartedWorkflows) handleStepChange(0, "processing");
  }, [isStartedWorkflows, franceTravailStatus]);

  {/* Assessment - update status with "like" or "dislike" */}
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
      <div
        className={`
          w-full
          p-4
          flex
          items-center
          text-center
          bg-gray-100
          dark:bg-neutral-900
          rounded-lg
          shadow
          dark:shadow-xl
        `}
      >
        {/* Stepper previous button */}
        <div className="flex justify-between">
          <BtnLoading
            title={<CircleArrowLeft size={24} />}
            loading={steps[currentStep].status === "processing"}
            onClick={previousStepHandler}
            width="80px"
            rounded="rounded-sm"
            isDisabled={currentStep === 0 || steps[currentStep].status === "processing"}
          />
        </div>
        
        {/* Stepper progress bar */}
        <div className="flex items-center justify-center flex-1 ps-4 pe-4">
          <Stepper steps={steps} />
        </div>
        
        {/* Stepper start/next button */}
        <div className="flex items-center gap-2">
          {/* Skip button */}
          {currentStep < steps.length - 1 && !isStartedWorkflows && (
            <span title="Skip">
              <BtnLoading
                title={<CircleChevronRight size={24} />}
                loading={isStartedWorkflows}
                onClick={nextStepHandler}
                width="80px"
                rounded="rounded-sm"
                isDisabled={isStartedWorkflows}
              />
            </span>
          )}

          {/* Start Button */}
          {currentStep === 0 && (
            <span title="Start">
              <BtnLoading
                title={<CirclePlay size={24} />}
                loading={steps[currentStep].status === "processing"}
                onClick={startEmailWorkflowsHandler}
                width="80px"
                rounded="rounded-sm"
                isDisabled={steps[currentStep].status === "processing" || (currentStep >= steps.length - 1 && steps[currentStep].status !== "active")}
              />
            </span>
          )}

          {/* Next Button */}
          {currentStep > 0 && (
            <span title="Next">
              <BtnLoading
                title={<CircleArrowRight size={24} />}
                loading={steps[currentStep].status === "processing"}
                onClick={nextStepHandler}
                width="80px"
                rounded="rounded-sm"
                isDisabled={steps[currentStep].status === "processing" || (currentStep >= steps.length - 1 || steps[currentStep].status === "error")}
              />
            </span>
          )}
        </div>
      </div>

      {/* N8N Workflow Panel */}
      <div className={`${currentStep === 0 ? "mt-2" : "hidden"} transition-all duration-300`}>
        <N8NWorkflowPanel />
      </div>

      {/* Unrated Management */}
      {currentStep === 1 && (<>
        <div className="flex justify-center mt-4 transition-all duration-300">
          <JobQueueUnrated />
        </div>
        {/* Unrated conter */}
        {unratedCounter > 0 && (
          <div className="flex justify-center mt-4 text-gray-600 dark:text-neutral-400 transition-all duration-300">
            {unratedCounter}
          </div>
        )}
      </>)}

      {/* Job Explorer */}
      { currentStep === 2 && (
        <div className="flex justify-center mt-4 transition-all duration-300">
          <JobExplorer />
        </div>
      )}

    </div>
  );
}
