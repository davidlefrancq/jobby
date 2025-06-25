'use client';
import Image from "next/image";
import { Lora } from "next/font/google";
import MenuActionBar from "./components/MenuActionBar";
import JobBoard from "./components/JobBoard";
import CVPanel from "./components/CVPanel";
import { useAppSelector, useAppDispatch } from "./store";
import { MenuTargetEnum } from "./store/menuReducer";
import N8NWorkflowPanel from "./components/N8NWorkflowPanel";
import ErrorsPanel from "./components/ErrorsPanel";
import png_jobby from '../../public/icon-192-jobby-persona-logo-rounded.png';
import { useEffect, useState } from "react";
import { APIHealthCheck } from "./lib/APIHealthCheck";
import { setIsAliveApi } from "./store/healthReducer";

const lora = Lora({
  weight: ["400", "700"],
  subsets: ["latin"],
});

let firstRender = true;

export default function HomePage() {
  const dispatch = useAppDispatch();

  const { target } = useAppSelector(state => state.menuReducer)
  const { isAliveApi } = useAppSelector(state => state.healthReducer)

  const [showApiError, setShowApiError] = useState(false);

  useEffect(() => {
    if (firstRender) {
      firstRender = false;

      // If the API is not alive after 1 second, show the error message
      setTimeout(() => setShowApiError(true), 1000);

      // Perform the API health check
      APIHealthCheck.check().then(isAlive => {
        dispatch(setIsAliveApi(isAlive));
      }).catch(() => {
        dispatch(setIsAliveApi(false));
      });
    }
  }, []);

  return (
    <section className="w-full">
      <div className="w-full mx-0 p-3">
        <div className="flex justify-between items-center pt-2 ms-2 pe-2 pb-8 mb-1 border-b border-gray-200">
          {/* App Name */}
          <div className="flex items-center gap-0">
            <Image src={png_jobby} alt="Job Board Logo" className="h-14 w-14 rounded-full" />
            <h1 className={`${lora.className} text-3xl font-bold text-gray-800`}>Jobby</h1>
          </div>
          
          {/* Menu */}
          <MenuActionBar />

        </div>
        
        <N8NWorkflowPanel />
        <ErrorsPanel />

        {target === MenuTargetEnum.Jobs && <JobBoard />}
        {target === MenuTargetEnum.CVs && <CVPanel />}

        {!isAliveApi && showApiError && (
          <div className="text-red-500 text-center mt-4">
            <p className="text-lg font-semibold">API is not responding.</p>
            <p>Please check the server status or try again later.</p>
          </div>
        )}
      </div>
    </section>
  );
}
