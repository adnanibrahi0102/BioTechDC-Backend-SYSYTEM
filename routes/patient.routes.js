import {Router} from 'express';
import { createPatientController, deletePatientController, getAllPatientsController, getPatientController, updatePatientController } from '../controllers/patient.controller.js';
import { isAdmin, verifyJwt } from '../middlewares/auth.middleware.js';


const router = Router();

router.route("/createPatient").post(verifyJwt , isAdmin , createPatientController);

router.route("/getPatient/:patientId").get(verifyJwt , isAdmin , getPatientController);

router.route("/getAllPatients").get(verifyJwt , isAdmin , getAllPatientsController);

router.route("/updatePatient/:patientId").patch(verifyJwt , isAdmin , updatePatientController);

router.route("/deletePatient/:patientId").delete(verifyJwt , isAdmin , deletePatientController)


export default router;