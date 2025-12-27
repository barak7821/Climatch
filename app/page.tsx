"use client"

import { useEffect } from "react"
import { pingServerApi } from "./services/weatherApiClient";
import { useRouter } from "next/navigation";
import { errorLog, log } from "./lib/logger";
import { useNotyf } from "./utils/useNotyf";

export default function WakeUp() {
    const router = useRouter()
    const notyf = useNotyf()

    const pingServer = async () => {
        try {
            await pingServerApi()
            router.push("/home")
            log("Server is ready")
        } catch (error) {
            errorLog("Error pinging server:", error)
            notyf?.error("Server is not ready. Please wait...")

            // Retry after a delay if the server is not ready
            setTimeout(() => {
                pingServer()
            }, 5000) // Retry after 5 seconds
        }
    }

    useEffect(() => {
        pingServer()
    }, [])

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-200 select-none">

            <div className="text-center text-2xl m-10">
                <p>Waking up the server...</p>
                <p>Please wait a few seconds</p>
            </div>

            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-600 text-lg">Loading...</p>
            </div>
        </div>
    )
}
