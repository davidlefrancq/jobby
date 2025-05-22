'use client';

import { useAppDispatch, useAppSelector } from "../store";
import { removeAlert } from "../store/alertsReducer";
import AlertMessage, { IAlert } from "./AlertMessage";

export default function ErrorsPanel() {
  const dispatch = useAppDispatch()
  const { alerts } = useAppSelector(state => state.alertsReducer)

  const handleRemoveError = (error: IAlert) => {
    dispatch(removeAlert(error.date))
  }

  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 items-center">
      {alerts.map((alert, index) => (
        <AlertMessage
          key={index}
          alert={alert}
          onRemove={handleRemoveError}
        />
      ))}
    </div>
  );
}