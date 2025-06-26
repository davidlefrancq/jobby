import { ReactNode } from "react";

export interface StepProps {
  children: ReactNode;
  stepKey: number;
}

export default function Step({ children }: StepProps) {
  return <>{children}</>;
}
