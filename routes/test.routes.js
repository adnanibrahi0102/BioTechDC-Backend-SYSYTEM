import {Router} from 'express';
import { createTestController, deleteTestController, getAllTestsController, getTestController, updateTestController } from '../controllers/test.controller.js';
import { isAdmin, verifyJwt } from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/createTest").post( verifyJwt,isAdmin,createTestController);

router.route("/getTest/:testId").get(verifyJwt , isAdmin , getTestController);

router.route("/getAllTests").get( getAllTestsController);

router.route("/deleteTest/:testId").delete(verifyJwt , isAdmin, deleteTestController);

router.route("/updateTest/:testId").patch(verifyJwt , isAdmin , updateTestController );

export default router;