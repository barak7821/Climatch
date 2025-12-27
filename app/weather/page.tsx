"use client"

import { useEffect, useState } from 'react'
import { useWeather } from '../utils/WeatherContext'
import type { WeatherData } from '../lib/types'
import Loading from '../loading'
import { getFallbackColor, getSkyPalette, getWeatherOverlay } from '../lib/skyPalettes'

export default function Weather() {
    const { weatherData, outfitSuggestion } = useWeather()
    const [isHydrated, setIsHydrated] = useState(false)
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
    })

    useEffect(() => {
        setIsHydrated(true)
    }, [])

    const mainWeather = weatherData?.weather?.[0]?.main as WeatherData["weather"][number]["main"] | undefined
    const fallbackColor = getFallbackColor(mainWeather)
    const hour = new Date().getHours()
    const palette = getSkyPalette(hour, mainWeather)
    const weatherOverlay = getWeatherOverlay(mainWeather)

    const cardBg = {
        Clear: "bg-sky-200/60",
        Clouds: "bg-slate-300/60",
        Rain: "bg-slate-500/55",
        Drizzle: "bg-slate-500/55",
        Thunderstorm: "bg-slate-800/60",
        Squall: "bg-slate-800/60",
        Snow: "bg-sky-200/55",
        Fog: "bg-slate-300/55",
        Haze: "bg-slate-300/55",
        Mist: "bg-slate-300/55",
        Sand: "bg-amber-300/55",
        Dust: "bg-amber-300/55",
        Smoke: "bg-amber-300/55",
        Ash: "bg-amber-300/55",
        Tornado: "bg-slate-800/60",
        Default: "bg-sky-200/70"
    }

    const cardBgClass = mainWeather ? (cardBg[mainWeather as keyof typeof cardBg] || cardBg.Default) : cardBg.Default

    if (!isHydrated) {
        return (
            <div className="min-h-screen bg-linear-to-b from-sky-400 via-sky-500 to-indigo-700 px-6 py-6">
                <Loading />
            </div>
        )
    }

    if (!weatherData) return <div className="flex items-center justify-center h-screen text-gray-500 text-xl">No weather data available.</div>

    const minTemp = weatherData.main.temp_min ?? weatherData.main.temp
    const maxTemp = weatherData.main.temp_max ?? weatherData.main.temp

    return (
        <div className="relative min-h-screen overflow-hidden text-white">
            <div
                className="absolute inset-0 animated-sky"
                style={{
                    backgroundImage: `radial-gradient(circle at 20% 12%, ${palette.glow}, transparent 55%), linear-gradient(180deg, ${palette.top} 0%, ${palette.upper} 28%, ${palette.mid} 55%, ${palette.lower} 78%, ${palette.bottom} 100%)`,
                    backgroundColor: fallbackColor
                }}
            />
            <div className="absolute inset-0" style={{ backgroundColor: weatherOverlay }} />

            <div className="relative z-10 flex min-h-screen flex-col items-center px-4 pb-10 pt-12 text-center">
                <div className="w-full max-w-md">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-1 text-sm font-semibold uppercase tracking-[0.2em] shadow-lg backdrop-blur-xl animate-fade-up">
                        {today}
                    </div>
                    <div className="mt-5 text-2xl font-semibold tracking-wide drop-shadow-sm animate-fade-up animate-fade-up-delay-1">
                        {weatherData.name}, {weatherData.sys.country}
                    </div>
                </div>

                <div className="mt-8 w-full max-w-md animate-fade-up animate-fade-up-delay-2">
                    <div className="text-[7.5rem] font-light leading-none tracking-tight drop-shadow-xl">
                        {Math.round(weatherData.main.temp)}°
                    </div>
                    <div className="mt-2 text-xl font-medium capitalize text-white/90">
                        {weatherData.weather[0].description}
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
                        <span>H {Math.round(maxTemp)}°</span>
                        <span>L {Math.round(minTemp)}°</span>
                    </div>
                </div>

                <div className="mt-10 w-full max-w-md rounded-3xl border border-white/25 bg-white/20 p-5 shadow-2xl backdrop-blur-2xl animate-fade-up animate-fade-up-delay-3">
                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div className={`${cardBgClass} rounded-2xl border border-white/15 p-4`}>
                            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Feels Like</div>
                            <div className="mt-2 text-2xl font-semibold">{Math.round(weatherData.main.feels_like)}°C</div>
                        </div>
                        <div className={`${cardBgClass} rounded-2xl border border-white/15 p-4`}>
                            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Humidity</div>
                            <div className="mt-2 text-2xl font-semibold">{weatherData.main.humidity}%</div>
                        </div>
                        <div className={`${cardBgClass} rounded-2xl border border-white/15 p-4`}>
                            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Wind</div>
                            <div className="mt-2 text-2xl font-semibold">{weatherData.wind.speed} m/s</div>
                        </div>
                        <div className={`${cardBgClass} rounded-2xl border border-white/15 p-4`}>
                            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Condition</div>
                            <div className="mt-2 text-2xl font-semibold capitalize">{weatherData.weather[0].main}</div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 w-full max-w-md">
                    <div className="rounded-3xl border border-white/25 bg-white/20 px-5 py-4 text-left text-base font-medium leading-relaxed shadow-xl backdrop-blur-2xl">
                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Outfit Suggestion</div>
                        <div className="mt-2 text-white/95">{outfitSuggestion}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
