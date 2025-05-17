'use client';

import { CSSProperties, useEffect, useRef, useState } from "react";
import { Bell } from 'lucide-react';

export interface INotification {
  id: number;
  message: string;
}

interface NotificationsProps {
  notifications: INotification[];
  removeNotification: (id: number) => void;
}

export default function NotificationsPanel({ notifications, removeNotification }: NotificationsProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Fermer si clic en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Close panel if no notifications
  useEffect(() => {
    if (open) {
      if (notifications.length === 0) {
        setOpen(false);
      }
    }
  }, [notifications])

  const handleRemoveNotification = (id: number) => {
    if (notifications.length > 0) {
      if (id && removeNotification) {
        removeNotification(id);
      }
    }
  }

  // Button CSS
  let btnClassName = "text-white focus:ring-4 font-medium rounded-full text-sm px-2.5 py-2.5 focus:outline-none";
  if (notifications.length === 0) {
    btnClassName += " bg-gray-300 hover:bg-gray-400 focus:ring-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600 dark:focus:ring-gray-700";
  }
  if (notifications.length > 0) {
    btnClassName += " bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 relative";
  }

  // Button style
  const btnStyle: CSSProperties = {
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  };
  if (notifications.length === 0) {
    btnStyle.cursor = '';
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        ref={toggleRef}
        onClick={() => setOpen(!open)}
        className={btnClassName}
        style={btnStyle}
      >
        <Bell size={18} />
        {notifications.length > 0 ? <span className="absolute top-1 right-2 w-2 h-2 bg-green-400 rounded-full shadow-md" /> : null}
      </button>

      {/* Notification Panel */}
      {open && (
        <div
          ref={panelRef}
          className="fixed top-16 right-4 w-80 max-h-[80vh] bg-white shadow-xl border border-gray-200 rounded-lg z-[9999] overflow-y-auto"
        >
          <div className="p-4 border-b font-semibold text-gray-800">Notifications</div>

          <ul className="divide-y divide-gray-100">
            {notifications.length > 0 ? notifications.map((notif) => (
              <li
                key={notif.id}
                className="flex justify-between items-center p-4 hover:bg-gray-50"
              >
                <span className="text-sm text-gray-700">{notif.message}</span>
                <div className="flex space-x-2">
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleRemoveNotification(notif.id)}
                  >
                    ✕
                  </button>
                </div>
              </li>
            )) : <li className="p-4 text-gray-500">Aucune notification</li>}
          </ul>
        </div>
      )}
    </>
  );
}