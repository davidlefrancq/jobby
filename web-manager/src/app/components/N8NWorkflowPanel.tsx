'use client';


import N8NWorkflowFranceTravail from "./N8NWorkflowFranceTravail";


export default function N8NWorkflowPanel() {

  /**
   * FR: Rendu de la barre de progression en fonction de la progression actuelle.
   * EN: Renders the progress bar based on the current progress.
   */
  return (
    <div className="flex flex-col gap-4 p-4">
      <N8NWorkflowFranceTravail />
    </div>
  );
}