import mongoose, { Schema } from "mongoose";

const patientSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "name is required"]
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
        phone: {
            type: String,
            required: [true , "phone is required"]
        },
        email: {
            type: String,
            required: [true,"email is required"]
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
        }
       
    },
    {
        timestamps: true
    }
);

export const Patient = mongoose.model("Patient" , patientSchema);