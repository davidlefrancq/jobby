'use client';


import { useEffect } from "react";
import N8NWorkflowFranceTravail from "./N8NWorkflowFranceTravail";
import N8NWorkflowFranceTravailJobForm from "./N8NWorkflowFranceTravailJobForm";
import { useAppDispatch, useAppSelector } from "../store";
import { setAutoMode } from "../store/menuReducer";
import { LocalStorageManager } from "../lib/LocalStorageManager";


export default function N8NWorkflowPanel() {
  const dispatch = useAppDispatch();
  const { autoMode } = useAppSelector(state => state.menuReducer);

  /**
   * FR: Charge le mode manuel depuis localStorage au montage.
   * EN: Loads the manual mode from localStorage on mount.
   */
  useEffect(() => {
    const isAutoMode = LocalStorageManager.getIsAutoMode();
    if (isAutoMode !== autoMode) dispatch(setAutoMode(isAutoMode));
  }, []);

  /**
   * FR: Sauvegarde le mode manuel dans localStorage.
   * EN: Saves the manual mode in localStorage.
   */
  useEffect(() => {
    const stored = LocalStorageManager.getIsAutoMode();
    if (autoMode !== stored) LocalStorageManager.setIsAutoMode(autoMode);
  }, [autoMode]);

  /**
   * FR: Rendu de la barre de progression en fonction de la progression actuelle.
   * EN: Renders the progress bar based on the current progress.
   */
  const manualVisibility = autoMode ? "hidden" : "block";
  const autoVisibility = autoMode ? "block" : "hidden";
  return (
    <div className="flex flex-col gap-2">
      {/* FranceTravail Manual Mode */}
      <div className={`relative ${manualVisibility}`}>
        <N8NWorkflowFranceTravailJobForm />
      </div>
      {/* FranceTravail Auto Mode */}
      <div className={`relative ${autoVisibility}`}>
        <N8NWorkflowFranceTravail />
      </div>
    </div>
  );
}