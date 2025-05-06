export const getUserPosition = async () => {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                position => resolve(position),
                error => reject(error),
                {
                    timeout: 10000, // Set a timeout of 10 seconds
                    maximumAge: 60000, // Accept cached position up to 1 minute old
                    enableHighAccuracy: false // No need for high accuracy for weather
                }
            )
        })
        const { latitude, longitude } = position.coords
        return { latitude, longitude }
    } catch (error) {
        console.error("Error getting location:", error)
        // Custom error messages based on error code

        const msg =
            error.code === 1 ? "permission_denied" :
                error.code === 2 ? "position_unavailable" :
                    error.code === 3 ? "timeout" : "unknown_error"
        throw new Error(msg)
    }
}