import Express from "express"
import { getForecast, getManualForecast } from "../controllers/weather.js"

const router = Express.Router()

router.post("/", getForecast)
router.post("/manual", getManualForecast)

export default router