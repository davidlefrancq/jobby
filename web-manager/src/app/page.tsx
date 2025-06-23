'use client';
import { Lora } from "next/font/google";
import MenuActionBar from "./components/MenuActionBar";
import JobBoard from "./components/JobBoard";
import CVPanel from "./components/CVPanel";
import { useAppSelector } from "./store";
import { MenuTargetEnum } from "./store/menuReducer";
import N8NWorkflowPanel from "./components/N8NWorkflowPanel";
import ErrorsPanel from "./components/ErrorsPanel";

const lora = Lora({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function HomePage() {
  const { target } = useAppSelector(state => state.menuReducer)

  return (
    <section className="w-full">
      <div className="w-full mx-0 p-3">
        <div className="flex justify-between items-center pt-2 ms-2 pe-2 pb-8 mb-1 border-b border-gray-200">
          {/* App Name */}
          <div className="flex items-center gap-0">
            <img src="icon-192-jobby-persona-logo-rounded.png" alt="Job Board Logo" className="h-14 w-14 rounded-full" />
            <h1 className={`${lora.className} text-3xl font-bold text-gray-800`}>Jobby</h1>
          </div>
          
          {/* Menu */}
          <MenuActionBar />

        </div>
        
        <N8NWorkflowPanel />
        <ErrorsPanel />

        {target === MenuTargetEnum.Jobs && <JobBoard />}
        {target === MenuTargetEnum.CVs && <CVPanel />}
      </div>
    </section>
  );
}
