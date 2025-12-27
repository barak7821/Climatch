import { errorLog, log } from "@/app/lib/logger"
import { getCachedValue, setCachedValue } from "@/app/lib/requestCache"
import { checkRateLimit, getClientIp } from "@/app/lib/rateLimit"
import { AIResponse, setAIPrompt, weatherResponse } from "@/app/lib/apiServices"

const RATE_LIMIT_MAX = 30
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const CACHE_TTL_MS = 10 * 60 * 1000

// This function fetches the weather forecast based on latitude and longitude
export const POST = async (request: Request) => {
    const { latitude, longitude, style } = await request.json()
    if (latitude === undefined || longitude === undefined || latitude === null || longitude === null || !style) {
        return new Response(JSON.stringify({ error: "Latitude, longitude, and style are required" }), { status: 400 })
    }

    const clientIp = getClientIp(request)
    const rateLimit = checkRateLimit(`weather:${clientIp}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)
    if (!rateLimit.allowed) {
        const retryAfterSeconds = Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
            status: 429,
            headers: { "Retry-After": String(retryAfterSeconds) }
        })
    }

    const styleKey = String(style).trim().toLowerCase()
    const cacheKey = `weather:${latitude}:${longitude}:${styleKey}`
    const cached = getCachedValue<{ weather: unknown; outfit: string }>(cacheKey)
    if (cached) {
        return new Response(JSON.stringify(cached), {
            status: 200,
            headers: { "x-cache": "HIT" }
        })
    }

    try {
        const weatherRes = await weatherResponse(latitude, longitude)
        const prompt = setAIPrompt(weatherRes.data, style)
        const aiRes = await AIResponse(prompt)

        log("Data fetched successfully")
        const payload = { weather: weatherRes.data, outfit: aiRes.data.choices[0].message.content }
        setCachedValue(cacheKey, payload, CACHE_TTL_MS)
        return new Response(JSON.stringify(payload), {
            status: 200,
            headers: { "x-cache": "MISS" }
        })
    } catch (error: any) {
        errorLog("Error in weather controller", error.message)
        return new Response(JSON.stringify({ message: error.message || "Internal Server Error" }), { status: 500 })
    }
}
