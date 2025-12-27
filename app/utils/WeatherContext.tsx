"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import type { WeatherData, WeatherContextValue } from '../lib/types'

const WeatherContext = createContext<WeatherContextValue | null>(null)

export const WeatherProvider = ({ children }: { children: React.ReactNode }) => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
    const [outfitSuggestion, setOutfitSuggestion] = useState<string | null>(null)

    useEffect(() => {
        const storedWeather = localStorage.getItem("weatherData")
        if (storedWeather && storedWeather !== "undefined") {
            try {
                setWeatherData(JSON.parse(storedWeather))
            } catch {
                localStorage.removeItem("weatherData")
            }
        }
        const storedOutfit = localStorage.getItem("outfitSuggestion")
        if (storedOutfit) {
            setOutfitSuggestion(storedOutfit)
        }
    }, [])

    useEffect(() => {
        if (weatherData !== null) {
            // Store weather data in localStorage
            localStorage.setItem("weatherData", JSON.stringify(weatherData))
        }

        if (outfitSuggestion !== null) {
            // Store outfit suggestion in localStorage
            localStorage.setItem("outfitSuggestion", outfitSuggestion)
        }
    }, [weatherData, outfitSuggestion])

    return (
        <WeatherContext.Provider value={{ weatherData, setWeatherData, outfitSuggestion, setOutfitSuggestion }}>
            {children}
        </WeatherContext.Provider>
    )
}

export const useWeather = () => {
    const context = useContext(WeatherContext)
    if (!context) {
        throw new Error("useWeather must be used within a WeatherProvider")
    }
    return context
} // Custom hook to use the WeatherContext
