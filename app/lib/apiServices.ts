import axios from "axios"
import countries from "i18n-iso-countries"
import enLocale from "i18n-iso-countries/langs/en.json" assert { type: "json" }
import { WeatherData } from "./types"
import { errorLog } from "./logger"

// Function to get OpenWeatherMap API key from environment variables
export const getOpenWeatherApiKey = () => {
    if (!process.env.OPENWEATHER_API_KEY) {
        errorLog("OPENWEATHER_API_KEY is missing")
        throw new Error("OPENWEATHER_API_KEY is not defined in environment variables")
    }
    return process.env.OPENWEATHER_API_KEY
}

// Function to fetch weather data from OpenWeatherMap API
export const weatherResponse = async (latitude: number, longitude: number) => {
    const apiKey = getOpenWeatherApiKey()
    return await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
}

// Function to fetch weather data by geocoding a city name
export const geocodeCity = async (city: string) => {
    const apiKey = getOpenWeatherApiKey()
    const res = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)

    const lat = res.data[0]?.lat
    const lon = res.data[0]?.lon

    if (lat === undefined || lon === undefined) {
        errorLog(`Geocoding failed for city: ${city}`)
        throw new Error("Invalid city name or geocoding failed")
    }

    const res2 = await weatherResponse(lat, lon) // Pre-fetch to validate coordinates

    return res2
}

// Function to fetch country name from country code
export const getCountryName = (countryCode: string) => {
    countries.registerLocale(enLocale)
    return countries.getName(countryCode, "en", { select: "official" })
}

// Function to set AI prompt 
export const setAIPrompt = (weatherData: WeatherData, style: string
) => {
    const countryName = getCountryName(weatherData.sys.country)
    return `The user is in ${weatherData.name}, ${countryName}. The current weather is ${weatherData.weather[0].description} with a temperature of ${weatherData.main.temp}°C. Today's temperatures range from ${weatherData.main.temp_min}°C to ${weatherData.main.temp_max}°C. They prefer a ${style} outfit. Suggest a stylish and practical outfit for the whole day in 1-2 sentences, in a friendly and helpful tone. Be specific. Mention both upper and lower clothing (like shirt and pants), and make sure the outfit is comfortable throughout the full temperature range. Do not start with a greeting. Focus on the outfit suggestion right away. Keep it concise and avoid long explanations. Avoid brand names or specific product lines. Use general clothing terms only.`
}

// Function to 
export const AIResponse = async (prompt: string) => {
    const openRouterApiKey = process.env.OPENROUTER_API_KEY
    if (!openRouterApiKey) {
        errorLog("OPENROUTER_API_KEY is missing")
        throw new Error("OPENROUTER_API_KEY is not defined in environment variables")
    }

    return await axios.post("https://openrouter.ai/api/v1/chat/completions", {
        model: "mistralai/mistral-small-3.1-24b-instruct:free",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: prompt
                    }
                ]
            }
        ]
    },
        {
            headers: {
                Authorization: `Bearer ${openRouterApiKey}`,
                "Content-Type": "application/json"
            }

        })
}
