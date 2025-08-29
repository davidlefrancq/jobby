"use client"
import DatetimeTool from "@/app/lib/DatetimeTool"
import { useEffect, useState } from "react"

interface TimerProps {
  dateStart: Date
  dateEnd?: Date | null
}

export default function Timer({ dateStart, dateEnd }: TimerProps) {
  const [elapsed, setElapsed] = useState("")

  useEffect(() => {
    const update = () => {
      const end = dateEnd ?? new Date()
      const diffInSeconds = Math.floor((end.getTime() - dateStart.getTime()) / 1000)

      setElapsed(DatetimeTool.formatDuration(diffInSeconds))
    }

    update()
    const interval = setInterval(update, 1000)

    return () => clearInterval(interval)
  }, [dateStart, dateEnd])

  return <span>{elapsed}</span>
}
