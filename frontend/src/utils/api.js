import axios from "axios"

// Base URL for the API
const baseApiUrl = `${import.meta.env.VITE_BACKEND_URL}/api`

export const fetchWeatherData = async (latitude, longitude, style) => {
    const { data } = await axios.post(`${baseApiUrl}/weather`, {
        latitude,
        longitude,
        style
    })
    return data
}

export const fetchWeatherDataByCity = async (city, style) => {
    const { data } = await axios.post(`${baseApiUrl}/weather/manual`, {
        city,
        style
    })
    return data
}

export const pingServerApi = async () => {
    await axios.get(`${baseApiUrl}/ping`)
}
