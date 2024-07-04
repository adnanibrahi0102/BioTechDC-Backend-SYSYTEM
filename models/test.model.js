import mongoose, { Schema } from 'mongoose';


const testSchema = new Schema(
    {
        name:{
            type: String,
            required: [true, "test name is required"]
        },
        description:{
            type: String,
            required: [true, "test description is required"]
        },
        price:{
            type: String,
            required: [true, "test price is required"]
        },
        normalRange:{
            type: String,
            required: [true, "test normal range is required"]
        },
        abnormalRange:{
            type: String,
            required: [true, "test abnormal range is required"]
        },
        fasting:{
            type: String,
            required: [true, "test fasting is required"]
        }
    }
    , { timestamps: true });

export const Test = mongoose.model("Test", testSchema);