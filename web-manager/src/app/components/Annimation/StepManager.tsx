import { AnimatePresence, motion } from "framer-motion";
import { ReactElement } from "react";
import { StepProps } from "./Step";

interface StepManagerProps {
  currentStep: number;
  children: ReactElement<StepProps> | ReactElement<StepProps>[];
}

export default function StepManager({ currentStep, children }: StepManagerProps) {
  // Ensure children is an array of React elements with stepKey prop
  const steps = Array.isArray(children) ? children : [children];

  // Find the active step based on currentStep
  const active = steps.find((child) => child.props.stepKey === currentStep);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {active && (
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {active}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
