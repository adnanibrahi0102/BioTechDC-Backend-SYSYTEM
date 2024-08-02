import { isValidObjectId } from "mongoose";
import { Patient } from "../models/patient.model.js";

export const createPatientController = async (req, res) => {
    const { name, age, gender, address, phone, email, tests, examinedBy, amount, paymentStatus } = req.body;
    

    if (!name || typeof age !== "number" || !gender || !address || !phone || !email || !examinedBy || typeof amount !== "number" || typeof paymentStatus !== "boolean") {
        return res.status(400).json({
            message: "All fields are required and must be of correct type"
        });
    }

    try {
        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) {
            return res.status(400).json({
                message: "Patient already exists"
            });
        }

        const patient = new Patient({
            name,
            age,
            gender,
            address,
            phone,
            email,
            examinedBy,
            amount,
            paymentStatus,
            tests,

        });

        await patient.save();

        return res.status(201).json({
            message: "Patient created successfully",
            patient
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error while creating patient",
            error: error.message
        });
    }
};
export const getPatientController = async (req, res) => {
    const { patientId } = req.params;
    if (!patientId) {
        return res.status(400).json({
            message: "Patient id is required"
        });
    }
    if (!isValidObjectId(patientId)) {
        return res.status(400).json({
            message: "Invalid patient id"
        });
    }
    try {
        const patient = await Patient.findById(patientId).populate('tests');
        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }
        return res.status(200).json({
            message: "Patient found sucessFully",
            patient
        });
    } catch (error) {
        return req.status(500).json({
            message: "Error while getting patient",
            error: error.message
        })
    }
}

export const getAllPatientsController = async (req, res) => {
    try {
        const patients = await Patient.find({}).populate('tests');
        if (patients.length === 0) {
            return res.status(404).json({
                message: "No patients found"
            });
        }

        return res.status(200).json({
            message: "Patients found successfully",
            patients
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error while getting patients",
            error: error.message
        });
    }
};


export const updatePatientController = async (req, res) => {
    const { patientId } = req.params;
    const { phone, tests, amount, paymentStatus } = req.body;

    if (!patientId) {
        return res.status(400).json({
            message: "Patient id is required"
        });
    }
    if (!isValidObjectId(patientId)) {
        return res.status(400).json({
            message: "Invalid patient id"
        });
    }

    try {
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }
        if (phone) patient.phone = phone;
        if (typeof amount === "number") patient.amount = amount;
        if (typeof paymentStatus === "boolean") patient.paymentStatus = paymentStatus;
        if (Array.isArray(tests) && tests.every(test => isValidObjectId(test))) patient.tests = tests;

        await patient.save();
        return res.status(200).json({
            message: "Patient updated sucessFully",
            patient
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error while updating patient",
            error: error.message
        })
    }

}

export const deletePatientController = async (req, res) => {
    const { patientId } = req.params;

    if (!patientId) {
        return res.status(400).json({
            message: "Patient id is required"
        });
    }

    if (!isValidObjectId(patientId)) {
        return res.status(400).json({
            message: "Invalid patient id"
        });
    }

    try {
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        const deletePatient = await Patient.findByIdAndDelete(patient._id);
         return res.status(200).json({
            message: "Patient deleted sucessfully",
         })

    } catch (error) {

        return res.status(500).json({
            message: "Error while deleting patient",
            error: error.message
        })
    }
}