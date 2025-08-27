'use client';


import { useEffect, useState } from "react";
import N8NWorkflowFranceTravail from "./N8NWorkflowFranceTravail";
import N8NWorkflowFranceTravailJobForm from "./N8NWorkflowFranceTravailJobForm";
import FieldEditorBoolLight from "./FieldEditor/FieldEditorBoolLight";


export default function N8NWorkflowPanel() {

  const [isManualModeFT, setIsManualModeFT] = useState(false);

  /**
   * FR: Charge le mode manuel depuis localStorage au montage.
   * EN: Loads the manual mode from localStorage on mount.
   */
  useEffect(() => {
    const stored = localStorage.getItem("isManualModeFT");
    if (stored !== null) {
      setIsManualModeFT(stored === "true");
    }
  }, []);

  /**
   * FR: Sauvegarde le mode manuel dans localStorage.
   * EN: Saves the manual mode in localStorage.
   */
  useEffect(() => {
    localStorage.setItem("isManualModeFT", String(isManualModeFT));
  }, [isManualModeFT]);

  /**
   * FR: Rendu de la barre de progression en fonction de la progression actuelle.
   * EN: Renders the progress bar based on the current progress.
   */
  return (
    <div className="relative flex flex-col gap-2">
      {/* Toggle manual mode */}
      <div className="absolute top-0 right-0 z-9999">
        <FieldEditorBoolLight initialValue={isManualModeFT} legendValue="Manual Mode" saveFunction={(value) => setIsManualModeFT(value)} />
      </div>

      {/* FranceTravail Manual Mode */}
      {isManualModeFT && <N8NWorkflowFranceTravailJobForm />}
      {/* FranceTravail Auto Mode */}
      {!isManualModeFT && <N8NWorkflowFranceTravail />}
    </div>
  );
}