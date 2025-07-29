export type StepStatus = "default" | "active" | "success" | "error" | "processing";

export interface IStep {
  label: string;
  status: StepStatus;
}
