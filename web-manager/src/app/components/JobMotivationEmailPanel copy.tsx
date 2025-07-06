import { IJobEntity } from "@/types/IJobEntity";
import { useState } from "react";

interface JobMotivationEmailPanelProps {
  job: IJobEntity;
  onClose?: () => void;
}

export default function JobMotivationEmailPanel({ job, onClose }: JobMotivationEmailPanelProps) {
  const [motivationEmail, setMotivationEmail] = useState<string | null>(job.motivation_email || '');

  const handleSave = (e: MouseEvent) => {
    // Here you would typically send the updated motivation email to your backend
    // For now, we just log it to the console
    e.preventDefault();
    console.log("Saving motivation email:", motivationEmail);
  }

  const handleClose = () => {
    // Close the panel, you might want to reset the state or perform other actions
    console.log("Closing motivation email panel");
    if (typeof onClose === 'function') onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-lg font-bold border-b-1 border-b-gray-300">Edit Motivation Email</h2>
        <textarea
          className="w-full p-2 border border-gray-300 rounded mt-2"
          value={motivationEmail || ''}
          onChange={(e) => setMotivationEmail(e.target.value)}
          rows={10}
          cols={50}
        />
        <button
          className="mt-4 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}