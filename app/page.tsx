"use client"

import { useEffect, useState } from 'react'
import Loading from './loading'
import { useWeather } from './utils/WeatherContext'
import { fetchWeatherData, fetchWeatherDataByCity } from './services/weatherApiClient'
import { getUserPosition } from './utils/geolocation'
import { useRouter } from 'next/navigation';
import { useNotyf } from './utils/useNotyf';
import type { WeatherData } from './lib/types';
import { errorLog } from './lib/logger'

export default function Home() {
    const router = useRouter()
    const notyf = useNotyf()
    const [enabledLocationInput, setEnabledLocationInput] = useState(false)
    const [city, setCity] = useState("")
    const [latitude, setLatitude] = useState<number | null>(null)
    const [longitude, setLongitude] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const { setWeatherData, setOutfitSuggestion } = useWeather()
    const [style, setStyle] = useState("comfortable everyday")

    useEffect(() => {
        const checkLocationPermission = async () => {
            // Get the user's location using the Geolocation API, else use the manual input
            if (!enabledLocationInput) {
                try {
                    const { latitude, longitude } = await getUserPosition()
                    setLatitude(latitude)
                    setLongitude(longitude)
                } catch (error) {
                    if (error instanceof Error && error.message === "permission_denied") {
                        notyf?.error("Location permission denied. Please enter your location manually.")
                        errorLog("Location permission denied by user.")
                    } else {
                        notyf?.error("Unable to retrieve your location. Please enter it manually.")
                        errorLog("Error retrieving user location:", error)
                    }
                    setEnabledLocationInput(true)
                    return
                }
            }
        }
        checkLocationPermission()
    }, [])

    const handleStyleChange = (newStyle: string) => {
        setStyle(newStyle)
    }

    const handleClick = async () => {
        // Check if manual location input is enabled and city is provided
        if (enabledLocationInput && !city) {
            notyf?.error("Please enter a city.")
            return
        }

        setIsLoading(true) // Set loading state to true
        try {
            let weather: WeatherData
            let outfit: string

            if (enabledLocationInput) {
                const result = await fetchWeatherDataByCity(city, style)
                weather = result.weather
                outfit = result.outfit
            } else {
                if (latitude === null || longitude === null) {
                    notyf?.error("Unable to retrieve your location. Please try again.")
                    errorLog("Unable to retrieve user location.")
                    return
                }
                const result = await fetchWeatherData(latitude, longitude, style)
                weather = result.weather
                outfit = result.outfit
            }

            // Set the weather data and outfit suggestion in context
            setWeatherData(weather)
            setOutfitSuggestion(outfit)

            // Navigate to the weather page
            router.push("/weather")
        } catch (error) {
            errorLog("Error fetching weather data:", error)
            notyf?.error("Error fetching weather data. Please try again.")
        } finally {
            setIsLoading(false) // Set loading state to false
        }
    }

    // If loading is true, load the loading component
    if (isLoading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-blue-500 to-blue-300 px-6 py-6 font-sans select-none">
            <Loading />
        </div>
    )

    return (
        <div className="min-h-screen flex flex-col bg-linear-to-b from-blue-500 to-blue-300 px-6 py-6 justify-between font-sans select-none ">
            <div className="flex flex-col items-center justify-center flex-1 w-full">
                {/* Title */}
                <h1 className="text-7xl font-bold text-white drop-shadow-md tracking-wide mb-0 mt-50 italic font-serif">
                    Climatch
                </h1>
                <p className="text-lg text-white/90">
                    Let the Weather Choose Your Style
                </p>

                {/* City input field (manual) */}
                {enabledLocationInput &&
                    <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Enter your city"
                        className="w-full max-w-sm py-3 px-5 mt-6 mb-6 bg-white/30 text-white placeholder-white/80 rounded-lg focus:outline-none" />
                }

                {/* button */}
                <button onClick={handleClick} disabled={isLoading} aria-label="Get My Outfit Suggestion" className="w-full max-w-sm py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-white/80 transition">
                    Get My Outfit Suggestion
                </button>
            </div>

            {/* Style buttons */}
            <div className="flex flex-1 flex-col items-center justify-end w-full">
                {/* Title */}
                <p className="mb-2 text-white/90 text-lg font-medium">Choose your style (optional)</p>
                <div className="grid grid-cols-3 gap-2 w-full max-w-sm mb-8 mx-auto"> {/* Changed to grid-cols-3 */}
                    <button disabled={isLoading} aria-label="Casual style" className={`flex flex-col items-center justify-center py-1 font-medium rounded-lg transition text-xs ${style === "Casual" ? "bg-yellow-400 text-yellow-900 ring-2 ring-yellow-600" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"}`} onClick={() => handleStyleChange("Casual")}>
                        {/* Casual: T-shirt icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16.5 3l2.5 2.5-4 2V21h-5V7.5l-4-2L7.5 3h9z" /></svg>
                        Casual
                    </button>
                    <button disabled={isLoading} aria-label="Sport style" className={`flex flex-col items-center justify-center py-1 font-medium rounded-lg transition text-xs ${style === "Sport" ? "bg-green-400 text-green-900 ring-2 ring-green-600" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                        onClick={() => handleStyleChange("Sport")}>
                        {/* Sport: Running shoe icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 17l1.5-2.5L7 15l2-3 4 2 3-5 4 7v3H3z" /></svg>
                        Sport
                    </button>
                    <button disabled={isLoading} aria-label="Office style" className={`flex flex-col items-center justify-center py-1 font-medium rounded-lg transition text-xs ${style === "Office" ? "bg-blue-400 text-blue-900 ring-2 ring-blue-600" : "bg-blue-100 text-blue-700 hover:bg-blue-200"}`} onClick={() => handleStyleChange("Office")}>
                        {/* Office: Briefcase icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3h-8v4h8V3z" /></svg>
                        Office
                    </button>
                    <div className="col-span-3 flex justify-center gap-2 mt-1">
                        <button disabled={isLoading} aria-label="Elegant style" className={`flex flex-col items-center justify-center py-1 font-medium rounded-lg transition text-xs w-24 ${style === "Elegant" ? "bg-pink-400 text-pink-900 ring-2 ring-pink-600" : "bg-pink-100 text-pink-700 hover:bg-pink-200"}`} onClick={() => handleStyleChange("Elegant")}>
                            {/* Elegant: Dress icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 2l2 5h4l-3 7 2 8H7l2-8-3-7h4z" /></svg>
                            Elegant
                        </button> {/* Changed to grid-cols-3 */}
                        <button disabled={isLoading} aria-label="Streetwear style" className={`flex flex-col items-center justify-center py-1 font-medium rounded-lg transition text-xs w-24 ${style === "Streetwear" ? "bg-gray-400 text-gray-900 ring-2 ring-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`} onClick={() => handleStyleChange("Streetwear")}>
                            {/* Streetwear: Hoodie icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 2C7 2 4 7 4 12v8h16v-8c0-5-3-10-8-10zm0 0v4m-4 8h8" /></svg>
                            Streetwear
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="block text-center text-xs text-white/30 mt-12">
                © {new Date().getFullYear()} Climatch
            </div>
        </div>
    )
}
