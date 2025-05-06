import React, { createContext, useContext, useEffect, useState } from 'react'

const WeatherContext = createContext()

export const WeatherProvider = ({ children }) => {
    const [weatherData, setWeatherData] = useState(() => JSON.parse(localStorage.getItem("weatherData")) || null)
    const [outfitSuggestion, setOutfitSuggestion] = useState(() => localStorage.getItem("outfitSuggestion") || null)

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

export const useWeather = () => useContext(WeatherContext) // Custom hook to use the WeatherContext