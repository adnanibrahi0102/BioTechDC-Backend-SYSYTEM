import { Booking } from "../models/booking.model.js";



export const bookingControllerv = async (req, res) => {
    const { tests, examinedBy, amount, paymentStatus, age, gender, address } = req.body;

    const userId = req.user._id;

    if (typeof age !== "number" || !gender || !address || !examinedBy || typeof amount !== "number" || typeof paymentStatus !== "boolean") {
        return res.status(400).json({
            message: "All fields are required and must be of correct type"
        });
    }

    try {
        const newBooking = await Booking.create({
            tests,
            examinedBy,
            amount,
            paymentStatus,
            user: userId,
            age,
            gender,
            address
        })
        if (!newBooking) {
            return res.status(500).json({
                message: "Error creating booking"
            })
        }
        res.status(201).json({
            message: "Booking created successfully",
            booking: newBooking
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error while creating booking",
            error: error.message
        })
    }
}


export const getBookingByUser = async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {
        const bookings = await Booking.find({ user: userId }).populate('user', 'name email') 
        .populate('tests')

        if (bookings.length === 0) {
            return res.status(404).json({
                message: "No bookings found for this user"
            });
        }

        res.status(200).json({
            message: "Bookings found successfully",
            bookings
        });
    } catch (error) {
        console.error("Error while getting bookings:", error);
        res.status(500).json({
            message: "Error while getting bookings",
            error: error.message
        });
    }
};