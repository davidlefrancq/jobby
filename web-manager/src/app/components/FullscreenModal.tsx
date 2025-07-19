"use client";
import { Children, useEffect, useState } from "react";

interface FullscreenModalProps {
  children: React.ReactNode;
  title?: string;
  onClose?: () => void;
}

export default function FullscreenModal({ children, title, onClose }: FullscreenModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  useEffect(() => {
    // FR: Ouverture automatique du modal si des enfants sont présents
    // EN: Automatically open the modal if children are provided
    if (children && Children.count(children) > 0) {
      setIsOpen(true);
    }

    // FR: Fermer le modal si l'utilisateur appuie sur la touche "Escape"
    // EN: Close the modal if the user presses the "Escape" key
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [children])

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          id="fullscreen-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="fullscreen-modal-label"
        >
          {/* Container */}
          <div className="w-full h-full bg-white dark:bg-neutral-800 overflow-hidden flex flex-col max-w-full max-h-full animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200 dark:border-neutral-700">
              <h3
                id="fullscreen-modal-label"
                className="font-bold text-gray-800 dark:text-white"
              >
                {title}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleClose();
                }}
                className="size-8 inline-flex justify-center items-center rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
                aria-label="Close"
              >
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-4 overflow-y-auto text-gray-800 dark:text-neutral-400">
              {children}
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center gap-x-2 py-3 px-4 mt-auto border-t border-gray-200 dark:border-neutral-700">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleClose();
                }}
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
