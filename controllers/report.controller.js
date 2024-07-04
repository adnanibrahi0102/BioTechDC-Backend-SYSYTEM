import { isValidObjectId } from "mongoose";
import { Patient } from "../models/patient.model.js";
import { Report } from "../models/report.model.js";
import { generatePDF } from "../helpers/reportPdf.js";
import { sendSMS } from '../helpers/sms.js'
import { sendEmail } from '../helpers/sendEmail.js'
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

export const createReportController = async (req, res) => {
  const { patientId } = req.params;
  const { reports } = req.body;

  if (!patientId || !Array.isArray(reports) || reports.length === 0) {
    return res.status(400).json({
      message: "Patient ID and reports are required",
    });
  }

  if (!isValidObjectId(patientId)) {
    return res.status(400).json({
      message: "Invalid patient id",
    });
  }

  try {
    const patient = await Patient.findById(patientId).populate("tests");

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    // Prepare and validate reports
    const validatedReports = [];
    for (const report of reports) {
      const { result, unit, testIds } = report;

      // Validate required fields
      if (!result || !unit || !testIds || !Array.isArray(testIds) || testIds.length === 0) {
        return res.status(400).json({
          message: "Result, unit, and test IDs are required for each report",
        });
      }

      // Check if all testIds are valid ObjectId
      for (const testId of testIds) {
        if (!isValidObjectId(testId)) {
          return res.status(400).json({
            message: `Invalid test ID: ${testId}`,
          });
        }
      }

      // Find corresponding tests and prepare report data
      const tests = patient.tests.filter((test) => testIds.includes(test._id.toString()));
      if (tests.length !== testIds.length) {
        return res.status(404).json({
          message: "Not all test IDs were found for the patient",
        });
      }

      const preparedReport = {
        result,
        unit,
        tests: tests.map((test) => test._id),
      };

      validatedReports.push(preparedReport);
    }

    const createdReport = await Report.create({
      patient: patient._id,
      reports: validatedReports,
      status: "pending",
    });

    res.status(201).json({
      message: "Report created successfully",
      report: createdReport,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error while creating report",
      error: error.message,
    });
  }
};



export const getAllReports = async (req, res) => {
  try {
    const allReports = await Report.find({}).populate({
      path: 'reports.tests patient',
      model: 'Test'
    })
      .populate('patient');

    if (!allReports || allReports.length === 0) {
      return res.status(404).json({
        message: "No reports found"
      });
    }

    return res.status(200).json({
      message: "Reports found successfully",
      reports: allReports
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error while getting reports",
      error: error.message
    });
  }
};


export const generateAndSendReport = async (req, res) => {
  const { reportId } = req.params;

  if (!reportId) {
    return res.status(400).json({ message: "Report ID is required" });
  }

  if (!isValidObjectId(reportId)) {
    return res.status(400).json({ message: "Invalid report id" });
  }

  try {
    const report = await Report.findById(reportId).populate('patient reports.tests');

    // Log the report to inspect its contents
    console.log('Fetched Report:', report);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const patient = report.patient;
    if (!patient) {
      return res.status(404).json({ message: "Patient not found for this report" });
    }

    const pdfPath = generatePDF(report, patient);
    const downloadLink = `${req.protocol}://${req.get('host')}/api/v1/reports/download/${report._id}`;

    const emailText = `Your lab report is ready. Download it from the link below:\n${downloadLink}`;
    const emailHtml = `<p>Your lab report is ready. Download it from the link below:</p><p><a href="${downloadLink}">Download Report</a></p>`;

    await sendEmail(patient.email, emailText, emailHtml);

    report.status = 'sent';
    await report.save();

    return res.status(200).json({ message: 'Report link sent successfully', reportLink: downloadLink });

  } catch (error) {
    console.error("Error while generating and sending report:", error);
    return res.status(500).json({ message: 'Error while generating and sending report', error: error.message });
  }
};


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const downloadReport = (req, res) => {
  const { reportId } = req.params;

  if (!reportId) {
    return res.status(400).json({ message: 'Report ID is required' });
  }

  // Example path where your PDFs are stored
  const pdfPath = path.join(__dirname, '../reports', `${reportId}.pdf`);

  try {
    if (fs.existsSync(pdfPath)) {
      res.download(pdfPath);
    } else {
      res.status(404).json({ message: 'PDF not found' });
    }
  } catch (error) {
    console.error('Error sending PDF:', error);
    res.status(500).json({ message: 'Error sending PDF', error: error.message });
  }
};

export const deleteReportControler = async (req, res) => {
  const { reportId } = req.params;

  if (!reportId) {
    return res.status(400).json({ message: "Report ID is required" });
  }

  if (!isValidObjectId(reportId)) {
    return res.status(400).json({ message: "Invalid report id" });
  }

  try {
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    await Report.findByIdAndDelete(report._id);
    return res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    return
    res.status(500).json({ message: "Error while deleting report", error: error.message });
  }
}
