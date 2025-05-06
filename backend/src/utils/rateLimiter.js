import rateLimit from "express-rate-limit"

const weatherLimiter = rateLimit({
    windowMs: 60 * 1000,           // 1 minute
    max: 20,                       // limit each IP to 20 requests per windowMs
    message: { error: "Too many weather requests, try again in a minute." }
})

export default weatherLimiter