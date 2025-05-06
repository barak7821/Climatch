import React, { useEffect, useState } from 'react'
import { useWeather } from '../utils/WeatherContext'

export default function Weather() {
    const { weatherData, outfitSuggestion } = useWeather()
    const [bgLoaded, setBgLoaded] = useState(false)

    if (!weatherData) return <div className="flex items-center justify-center h-screen text-gray-500 text-xl">No weather data available.</div>

    const getFallbackColor = (mainWeather) => {
        switch (mainWeather) {
            case "Clear": return "#a3d2f2"
            case "Clouds": return "#d1d5db"
            case "Rain":
            case "Drizzle": return "#4b5563"
            case "Thunderstorm": return "#1f2937"
            case "Snow": return "#e0f2fe"
            case "Mist":
            case "Fog":
            case "Haze": return "#cbd5e1"
            case "Dust":
            case "Sand":
            case "Ash":
            case "Smoke": return "#facc15"
            case "Tornado":
            case "Squall": return "#111827"
            default: return "#a3d2f2"
        }
    }

    const mainWeather = weatherData?.weather?.[0]?.main
    const fallbackColor = getFallbackColor(mainWeather)


    const weatherToBg = {
        Clear: "/background/Clear.webp",
        Clouds: "/background/Clouds.webp",
        Rain: "/background/Rain.webp",
        Drizzle: "/background/Rain.webp",
        Thunderstorm: "/background/Storm.webp",
        Squall: "/background/Storm.webp",
        Snow: "/background/Snow.webp",
        Fog: "/background/Mist.webp",
        Haze: "/background/Mist.webp",
        Mist: "/background/Mist.webp",
        Sand: "/background/Dust.webp",
        Dust: "/background/Dust.webp",
        Smoke: "/background/Dust.webp",
        Ash: "/background/Dust.webp",
        Tornado: "/background/Tornado.webp",
        Default: "/background/Clear.webp"
    }

    const bgImage = weatherToBg[weatherData.weather[0].main] || weatherToBg.Default

    const cardBg = {
        Clear: "bg-sky-200/70",
        Clouds: "bg-gray-300/70",
        Rain: "bg-neutral-600/70",
        Drizzle: "bg-neutral-600/70",
        Thunderstorm: "bg-gray-800/70",
        Squall: "bg-gray-800/70",
        Snow: "bg-sky-100/70",
        Fog: "bg-gray-300/70",
        Haze: "bg-gray-300/70",
        Mist: "bg-gray-300/70",
        Sand: "bg-yellow-600/70",
        Dust: "bg-yellow-600/70",
        Smoke: "bg-yellow-600/70",
        Ash: "bg-yellow-600/70",
        Tornado: "bg-gray-800/70",
        Default: "bg-sky-200/70"
    }

    const cardBgClass = cardBg[weatherData.weather[0].main] || cardBg.Default

    useEffect(() => {
        setBgLoaded(false)
        const img = new Image()
        img.src = bgImage
        img.onload = () => setBgLoaded(true)
    }, [bgImage])

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-between px-4 py-10 font-sans select-none"
            style={{ backgroundImage: bgLoaded ? `url(${bgImage})` : "none", backgroundSize: "cover", backgroundPosition: "center", backgroundColor: fallbackColor }}>

            {/* Top: City and Country */}
            <div className="w-full max-w-md mx-auto text-center">
                <div className="text-2xl text-white/90 font-semibold tracking-wide drop-shadow-sm">
                    {weatherData.name}, {weatherData.sys.country}
                </div>
            </div>
            {/* Main Weather Icon and Temp */}
            <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center mb-2">
                <div className="text-9xl text-white drop-shadow-lg mb-1 tracking-tight ml-10">
                    {Math.round(weatherData.main.temp)}°
                </div>
                <div className="text-2xl text-white/90 font-medium capitalize mb-6 drop-shadow-sm tracking-tight">
                    {weatherData.weather[0].description}
                </div>
            </div>
            {/* Weather Details Cards */}
            <div className="w-full max-w-md mx-auto grid grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                <div className={`${cardBgClass} rounded-2xl shadow-xl p-5 flex flex-col items-center gap-1`}>
                    <span className="text-gray-500 text-xs font-semibold mb-0.5 tracking-wide">Feels Like</span>
                    <span className="text-2xl font-bold text-white">{Math.round(weatherData.main.feels_like)}°C</span>
                </div>
                <div className={`${cardBgClass} rounded-2xl shadow-xl p-5 flex flex-col items-center gap-1`}>
                    <span className="text-gray-500 text-xs font-semibold mb-0.5 tracking-wide">Humidity</span>
                    <span className="text-2xl font-bold text-white">{weatherData.main.humidity}%</span>
                </div>
                <div className={`${cardBgClass} rounded-2xl shadow-xl p-5 flex flex-col items-center gap-1`}>
                    <span className="text-gray-500 text-xs font-semibold mb-0.5 tracking-wide">Wind</span>
                    <span className="text-2xl font-bold text-white">{weatherData.wind.speed} m/s</span>
                </div>
                <div className={`${cardBgClass} rounded-2xl shadow-xl p-5 flex flex-col items-center gap-1`}>
                    <span className="text-gray-500 text-xs font-semibold mb-0.5 tracking-wide">Condition</span>
                    <span className="capitalize text-2xl font-bold text-white">{weatherData.weather[0].main}</span>
                </div>
            </div>
            {/* Suggestion */}
            <div className="w-full max-w-md mx-auto mb-4 md:mb-6">
                <div className={`${cardBgClass} rounded-xl p-4 text-white text-center font-medium shadow text-base md:text-lg tracking-tight`}>
                    {outfitSuggestion}
                </div>
            </div>
        </div>
    )
}