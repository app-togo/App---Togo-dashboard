"use client"

import { useState, useEffect } from "react"

export function useLiveMetrics(initialValue: number, range: number = 5, interval: number = 3000) {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        const timer = setInterval(() => {
            const change = (Math.random() - 0.5) * range
            setValue((prev) => {
                const newValue = prev + change
                // Keep it positive and within a reasonable range of initial
                return Math.max(0, Math.round(newValue * 10) / 10)
            })
        }, interval)

        return () => clearInterval(timer)
    }, [range, interval])

    return value
}

export function useLiveStatus() {
    const [status, setStatus] = useState("Active")
    const statuses = ["Active", "Optimizing", "Processing", "Synced"]

    useEffect(() => {
        const timer = setInterval(() => {
            if (Math.random() > 0.7) {
                const nextStatus = statuses[Math.floor(Math.random() * statuses.length)]
                setStatus(nextStatus)
            }
        }, 5000)

        return () => clearInterval(timer)
    }, [])

    return status
}
