import express from 'express'
import { addExperiencesController, getExperiencesController, experiencesDetailsController, bookingsController, promoValidateController } from '../Controllers/experiencesController.js';
import upload from '../config/multer.js';
const router = express.Router();

router.post('/addExperiences', upload.single("image"), addExperiencesController)
router.get('/getExperiences', getExperiencesController)
router.get('/experiences/:id', experiencesDetailsController)
router.post('/bookings' , bookingsController)
router.post('/promoValidate', promoValidateController)

export default router