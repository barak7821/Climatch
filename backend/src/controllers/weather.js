import axios from "axios"
import countries from "i18n-iso-countries"
import { createRequire } from "module"

const require = createRequire(import.meta.url)
countries.registerLocale(require("i18n-iso-countries/langs/en.json"))

// This function fetches the weather forecast based on latitude and longitude
export const getForecast = async (req, res) => {
    const { latitude, longitude, style } = req.body
    if (!latitude || !longitude) return res.status(400).json({ error: "Latitude and longitude are required" })
    try {
        // Fetch weather data from OpenWeatherMap API
        const apiKey = process.env.OPENWEATHER_API_KEY // Ensure you have this API key in your environment variables
        const weatherRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)

        // Convert country code to country name
        const countryName = countries.getName(weatherRes.data.sys.country, "en", { select: "official" })

        // Set prompt for AI model
        const prompt = `The user is in ${weatherRes.data.name}, ${countryName}. The current weather is ${weatherRes.data.weather[0].description} with a temperature of ${weatherRes.data.main.temp}°C. Today's temperatures range from ${weatherRes.data.main.temp_min}°C to ${weatherRes.data.main.temp_max}°C. They prefer a ${style} outfit. Suggest a stylish and practical outfit for the whole day in 1-2 sentences, in a friendly and helpful tone. Be specific. Mention both upper and lower clothing (like shirt and pants), and make sure the outfit is comfortable throughout the full temperature range. Do not start with a greeting. Focus on the outfit suggestion right away. Keep it concise and avoid long explanations. Avoid brand names or specific product lines. Use general clothing terms only.`

        // Set up the AI model request
        // Note: Ensure you have the OPENROUTER_API_KEY in your environment variables
        const aiRes = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
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
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }

            })

        // Send the weather data and AI response back to the client
        console.log("Data fetched successfully")
        res.status(200).json({
            weather: weatherRes.data,
            outfit: aiRes.data.choices[0].message.content
        })
    } catch (error) {
        console.error("Error in getForecast controller", error.message)
        res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}

export const getManualForecast = async (req, res) => {
    const { city, style } = req.body
    if (!city) return res.status(400).json({ error: "City is required" })
    try {
        // Fetch weather data from OpenWeatherMap API
        const apiKey = process.env.OPENWEATHER_API_KEY // Ensure you have this API key in your environment variables
        const geocodingRes = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
        const latitude = geocodingRes.data[0].lat
        const longitude = geocodingRes.data[0].lon

        const weatherRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)

        // Convert country code to country name
        const countryName = countries.getName(weatherRes.data.sys.country, "en", { select: "official" })

        // Set prompt for AI model
        const prompt = `The user is in ${weatherRes.data.name}, ${countryName}. The current weather is ${weatherRes.data.weather[0].description} with a temperature of ${weatherRes.data.main.temp}°C. Today's temperatures range from ${weatherRes.data.main.temp_min}°C to ${weatherRes.data.main.temp_max}°C. They prefer a ${style} outfit. Suggest a stylish and practical outfit for the whole day in 1-2 sentences, in a friendly and helpful tone. Be specific. Mention both upper and lower clothing (like shirt and pants), and make sure the outfit is comfortable throughout the full temperature range. Do not start with a greeting. Focus on the outfit suggestion right away. Keep it concise and avoid long explanations. Avoid brand names or specific product lines. Use general clothing terms only.`

        // Set up the AI model request
        // Note: Ensure you have the OPENROUTER_API_KEY in your environment variables
        const aiRes = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
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
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }

            })

        // Send the weather data and AI response back to the client
        console.log("Data fetched successfully - manual")
        res.status(200).json({
            weather: weatherRes.data,
            outfit: aiRes.data.choices[0].message.content
        })
    } catch (error) {
        console.error("Error in getManualForecast controller", error.message)
        res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}