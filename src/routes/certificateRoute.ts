import express from "express";
import certificateController from "../controller/certificateController";
import { isAdmin, isLoggedIn } from "../middleware/isLoggedin";
const router = express.Router();

router.get("/all", isAdmin, certificateController.getAllCertificates)
    .get("/ById/:id", certificateController.getCertificateById)
    .get("/byUser", isLoggedIn, certificateController.getCertificateByUserId)
    .delete("/:id", isAdmin, certificateController.deleteCertificate)
    .get("/download/:certificateId", certificateController.downloadCertificate)

export default router;
