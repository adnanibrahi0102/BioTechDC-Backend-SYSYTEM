import mongoose ,{Schema} from "mongoose";

const bookingSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tests: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Test',
            required: [true, "test is required"]
        }
    ],
    examinedBy: {
        type: String
    },
    amount:{
        type: Number,
        default:0
    },
    paymentStatus:{
        type: Boolean,
        default: false
    },
    age: {
        type: Number,
        required: [true , "age is required"]
    },
    gender: {
        type: String,
        required: [true , "gender is required"]
    },
    address: {
        type: String,
        required: [true , "address is required"]
    },
},{timestamps:true})

export const Booking = mongoose.model("Booking" , bookingSchema);