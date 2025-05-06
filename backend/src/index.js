import Express from "express"
import cors from "cors"
import dotenv from "dotenv"
import weatherRoutes from "./routes/weather.js"
import weatherLimiter from "./utils/rateLimiter.js"

dotenv.config()

const app = Express()
app.use(Express.json())
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*"
}))

// Define route handlers
app.use("/api/weather", weatherLimiter, weatherRoutes)

// Define a simple ping endpoint to check if the server is running
app.get("/api/ping", (req, res) => res.send("Running"))

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
