import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { bookingControllerv, getBookingByUser } from "../controllers/booking.controller.js";


const router = Router();

router.route("/create-booking").post(verifyJwt , bookingControllerv);

router.route("/getAll-user-bookings").get(verifyJwt , getBookingByUser)

export default router;