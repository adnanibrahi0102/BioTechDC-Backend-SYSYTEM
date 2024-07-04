import {Router} from 'express';
import { isAdmin, verifyJwt } from '../middlewares/auth.middleware.js';
import { createReportController, deleteReportControler, downloadReport, generateAndSendReport, getAllReports } from '../controllers/report.controller.js';


const router = Router();

router.route('/create-report/:patientId').post(verifyJwt , isAdmin ,createReportController);

router.route('/getAllReports').get(verifyJwt , isAdmin , getAllReports);

router.route('/delete-report/:reportId').delete(verifyJwt , isAdmin , deleteReportControler)

router.route('/generate-report/:reportId').post(generateAndSendReport)

router.route('/download/:reportId').get(downloadReport)

export default router;