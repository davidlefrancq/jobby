'use client';
import Image from "next/image";
import JobBoard from "./components/JobBoard";
import CVPanel from "./components/CVPanel";
import { useAppSelector, useAppDispatch } from "./store";
import { MenuTargetEnum } from "./store/menuReducer";
import ErrorsPanel from "./components/ErrorsPanel";
import png_jobby from '../../public/icon-192-jobby-persona-logo-rounded.png';
import { useEffect, useState } from "react";
import { APIHealthCheck } from "./lib/APIHealthCheck";
import { setIsAliveApi } from "./store/healthReducer";
import DarkModeToggleBtn from "./components/DarkModeToggleBtn";
import MenuSidebar from "./components/MenuSidebar";
import JobsStepper from "./components/JobsStepper";
import { N8N_HOME_PAGE } from "@/constants/n8n-webhooks";

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
    <div className="container mx-auto">
      <div
        className={`
          grid
          gap-2
          bg-gray-100
          dark:bg-neutral-900
          dark:text-white
          border-gray-100
          dark:border-neutral-700
          rounded-lg
          shadow-md
          transform
          transition-all
          duration-300
          lg:translate-x-0
        `}
      >
        <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full text-sm py-3">
          <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
            <a className="flex-none font-semibold text-xl text-black focus:outline-hidden focus:opacity-80 dark:text-white" href="#" aria-label="JobBy">
              <Image src={png_jobby} priority={true} alt="Job Board Logo" className="h-14 w-14 rounded-full" />
              <h1>JobBy</h1>
            </a>

            <div className="flex flex-row items-center gap-2 mt-2 sm:justify-end sm:mt-0 sm:ps-5">
              {/* Links exemple */}
              {/* 
              <a className="font-medium text-blue-500 focus:outline-hidden" href="#" aria-current="page">Link</a>
              <a className="font-medium text-gray-600 hover:text-gray-400 focus:outline-hidden focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500" href="#">Link</a>
              */}
              {/* N8N Button */}
              <button
                className={`
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                  h-[38px]
                  w-[38px]
                  focus:bg-gray-200
                  outline-gray-400
                  dark:outline-neutral-600
                  transition-all
                  rounded-full
                `}
                onClick={() => window.open(N8N_HOME_PAGE, '_blank')}
                title="N8N"
              >
                    <Image
                      src="/n8n.png"
                      width={30}
                      height={30}
                      priority={false}
                      alt="Picture of the author"
                      className={`
                        transition-all
                        hover:scale-125
                        focus:scale-125
                        dark:transition-all
                        dark:hover:scale-125
                        dark:focus:scale-125
                        rounded-full
                      `}
                    />
              </button>
              <DarkModeToggleBtn />
            </div>
          </nav>
        </header>
      </div>

      <div className="grid grid-cols-6 gap-0 m-0 p-0">
        <div className="col-span-1 dark:border-e-neutral-700">
          <MenuSidebar />
        </div>
        <div
          className={`
            col-span-5
            transform
            transition-all
            duration-300
            lg:translate-x-0
            dark:text-white
            border-gray-200
            dark:border-neutral-700
          `}
        >
          
          <ErrorsPanel />

          {target === MenuTargetEnum.steps && <JobsStepper />}
          {target === MenuTargetEnum.jobs && <JobBoard />}
          {target === MenuTargetEnum.cvs && <CVPanel />}
          
          {!isAliveApi && showApiError && (
            <div className="bg-gray-100 dark:bg-neutral-800 text-red-500 text-center mt-4">
              <p className="text-lg font-semibold">API is not responding.</p>
              <p>Please check the server status or try again later.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
