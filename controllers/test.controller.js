import { isValidObjectId } from "mongoose";
import { Test } from "../models/test.model.js";



export const createTestController = async (req, res) => {
    const { name, description, price, normalRange, abnormalRange, fasting } = req.body;

    if ([name, description, price, normalRange, abnormalRange, fasting].some((value) => value.trim() === "")) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {
        const existingTest = await Test.findOne({ name });
        if (existingTest) {
            return res.status(400).json({
                message: "Test already exists"
            });
        }

        const test = await Test.create(
            {
                name,
                description,
                price,
                normalRange,
                abnormalRange,
                fasting
            }
        );
        return res.status(201).json(
            {
                message: "Test created successfully",
                test
            }
        )
    } catch (error) {
        return res.status(500).json({
            message: "Error while creating test",
            error: error.message
        })
    }


}

export const getTestController = async (req, res) => {
    const { testId } = req.params;

    if (!testId) {
        return res.status(400).json({
            message: "Test id is required"
        });
    }

    if (!isValidObjectId(testId)) {
        return res.status(400).json({
            message: "Invalid test id"
        });
    }
    try {
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({
                message: "Test not found"
            });
        }
        return res.status(200).json({
            message: "Test found sucessFully",
            test
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error while getting test",
            error: error.message
        })
    }
}

export const getAllTestsController = async (req, res) => {
    try {
        const test = await Test.find({});
        if (test.length === 0) {
            return res.status(404).json({
                message: "No tests found"
            });
        }
        return res.status(200).json({
            message: "Tests found sucessFully",
            test
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error while getting tests",
            error: error.message
        })
    }
}

export const deleteTestController = async (req, res) => {

    const { testId } = req.params;

    if (!testId) {
        return res.status(400).json({
            message: "Test id is required"
        });
    }

    if (!isValidObjectId(testId)) {
        return res.status(400).json({
            message: "Invalid test id"
        });
    }

    try {
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({
                message: "Test not found"
            });
        }
        const deleteTest = await Test.findByIdAndDelete(testId);
        return res.status(200).json({
            message: "Test deleted sucessFully",

        });
    } catch (error) {
        return res
            .status(500)
            .json({
                message: "Error while deleting test",
                error: error.message
            });
    }
}


export const updateTestController = async (req, res) => {
    const { testId } = req.params;
    const { name, description, price, normalRange, abnormalRange, fasting } = req.body;
    if (!testId) {
        return res.status(400).json({
            message: "Test id is required"
        });
    }
    if (!isValidObjectId(testId)) {
        return res.status(400).json({
            message: "Invalid test id"
        });
    }

    try {
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({
                message: "Test not found"
            });
        }
        if (name) test.name = name;
        if (description) test.description = description;
        if (price) test.price = price;
        if (normalRange) test.normalRange = normalRange;
        if (abnormalRange) test.abnormalRange = abnormalRange;
        if (fasting) test.fasting = fasting;

        await test.save();
        return res.status(200).json({
            message: "Test updated sucessFully",
            test
        });
    } catch (error) {
        return res
            .status(500)
            .json({
                message: "Error while updating test",
                error: error.message
            });
    }
}