'use client';

import { FileText, Layers, Menu, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { MenuTargetEnum, selectMenuTarget } from "../store/menuReducer";
import { setJobQueueSelected } from "../store/jobsReducer";
import { JobQueueEnum } from "@/constants/JobQueueEnum";

export default function MenuSidebar() {
  const dispatch = useAppDispatch()
  const { target } = useAppSelector(state => state.menuReducer)
  const { dislikedJobs, dislikedCounter, likedJobs, likedCounter, unratedJobs, unratedCounter, jobQueueSelected } = useAppSelector(state => state.jobsReducer)
  const { cvs, cvsCounter } = useAppSelector(state => state.cvsReducer)

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(prev => !prev);
  const closeSidebar = () => setIsOpen(false);

  const normalStyle = "flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-gray-800 rounded-lg hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-white";
  const activeStyle = "flex items-center gap-x-3.5 py-2 px-2.5 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600";

  return (
    <>
      {/* Navigation Toggle */}
      <div className="lg:hidden py-16 text-center dark:text-white dark:bg-neutral-800">
        <button
          type="button"
          onClick={toggleSidebar}
          className="h-12 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-gray-800 border border-gray-800 text-white text-sm font-medium rounded-lg shadow-2xs align-middle hover:bg-gray-950 focus:outline-none focus:bg-gray-900 dark:bg-white dark:text-neutral-800 dark:hover:bg-neutral-200 dark:focus:bg-neutral-200"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <Menu />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 start-0 bottom-0 z-50 w-full transform transition-all duration-300 bg-white border-e border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 lg:translate-x-0 lg:static lg:block ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-label="Sidebar"
        tabIndex={-1}
      >
        <div className="relative flex flex-col h-full max-h-full">
          {/* Header */}
          <header className="p-2 flex justify-between items-center gap-x-2">
            <span
              className="flex-none font-semibold text-xl text-black dark:text-white focus:outline-none focus:opacity-80"
            >
              {/* Menu */}
            </span>

            <div className="lg:hidden -me-2">
              {/* Close Button */}
              <button
                type="button"
                onClick={closeSidebar}
                className="flex justify-center items-center gap-x-3 size-6 bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none focus:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
              >
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
          </header>

          {/* Body */}
          <nav className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-neutral-500 dark:scrollbar-track-neutral-700 px-2">
            <ul className="space-y-1 pb-4">

              {/* CVs Button */}
              <li>
                <Link
                  href="#"
                  className={`flex items-center gap-x-3.5 py-2 px-2.5 ${target === MenuTargetEnum.CVs ? activeStyle : normalStyle}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    dispatch(selectMenuTarget(MenuTargetEnum.CVs))
                  }}
                >
                  <FileText />
                  CVs
                  {cvsCounter > 0 && (
                    <span className="ms-auto py-0.5 px-1.5 inline-flex items-center gap-x-1.5 text-xs bg-gray-200 text-gray-800 rounded-full dark:bg-neutral-600 dark:text-neutral-200">
                      {`${cvs.length}/${cvsCounter}`}
                    </span>
                  )}
                </Link>
              </li>


              {/* Job Unrated Button */}
              <li>
                <Link
                  href="#"
                  className={`flex items-center gap-x-3.5 py-2 px-2.5 ${target === MenuTargetEnum.Jobs && jobQueueSelected === JobQueueEnum.Unrated ? activeStyle : normalStyle}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    dispatch(setJobQueueSelected(JobQueueEnum.Unrated))
                    dispatch(selectMenuTarget(MenuTargetEnum.Jobs))
                  }}
                >
                  <Layers />
                  In waiting
                  {unratedCounter > 0 && (
                    <span className="ms-auto py-0.5 px-1.5 inline-flex items-center gap-x-1.5 text-xs bg-gray-200 text-gray-800 rounded-full dark:bg-neutral-600 dark:text-neutral-200">
                      {`${unratedJobs.length}/${unratedCounter}`}
                    </span>
                  )}
                </Link>
              </li>

              {/* Job Liked Button */}
              <li>
                <Link
                  href="#"
                  className={`flex items-center gap-x-3.5 py-2 px-2.5 ${target === MenuTargetEnum.Jobs && jobQueueSelected === JobQueueEnum.Liked ? activeStyle : normalStyle}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    dispatch(setJobQueueSelected(JobQueueEnum.Liked))
                    dispatch(selectMenuTarget(MenuTargetEnum.Jobs))
                  }}
                >
                  <ThumbsUp />
                  Liked
                  {likedCounter > 0 && (
                    <span className="ms-auto py-0.5 px-1.5 inline-flex items-center gap-x-1.5 text-xs bg-gray-200 text-gray-800 rounded-full dark:bg-neutral-600 dark:text-neutral-200">
                      {`${likedJobs.length}/${likedCounter}`}
                    </span>
                  )}
                </Link>
              </li>

              {/* Job Disliked Button */}
              <li>
                <Link
                  href="#"
                  className={`flex items-center gap-x-3.5 py-2 px-2.5 ${target === MenuTargetEnum.Jobs && jobQueueSelected === JobQueueEnum.Disliked ? activeStyle : normalStyle}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    dispatch(setJobQueueSelected(JobQueueEnum.Disliked))
                    dispatch(selectMenuTarget(MenuTargetEnum.Jobs))
                  }}
                >
                  <ThumbsDown />
                  Disliked
                  {dislikedCounter > 0 && (
                    <span className="ms-auto py-0.5 px-1.5 inline-flex items-center gap-x-1.5 text-xs bg-gray-200 text-gray-800 rounded-full dark:bg-neutral-600 dark:text-neutral-200">
                      {`${dislikedJobs.length}/${dislikedCounter}`}
                    </span>
                  )}
                </Link>
              </li>

            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}