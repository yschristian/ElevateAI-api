import cerficateService from "../services/certificateService";
import catchAsync from "../helper/catchAsync";
import { Request } from "express";

interface CustomRequest extends Request {
    user: any;
}

const certificateController = {
    getAllCertificates: catchAsync(async (req, res) => {
        try {
            const certificates = await cerficateService.getAllCertificates();
            return res.status(200).json({
                message: "Certificates fetched successfully",
                data: certificates
            });
        } catch (error) {
            console.log(error)
        }
    }),
    getCertificateById: catchAsync(async (req, res) => {
        try {
            const id = req.params.id;
            const certificates = await cerficateService.getCeritificateById({ id });
            if (!certificates) return res.status(404).json({ error: "No certificate", });
            return res.status(200).json({
                message: "Certificate fetched successfully",
                data: certificates
            });
        } catch (error) {
            console.log(error)
        }
    }),
    getCertificateByUserId: catchAsync(async (req, res) => {
        try {
            const userId = (req as CustomRequest).user.id;
            const certificates = await cerficateService.getCeritificateById({ userId });
            if (!certificates) return res.status(404).json({ error: "No certificate!", });
            return res.status(200).json({
                message: "Certificate fetched successfully",
                data: certificates
            });
        } catch (error) {
            console.log(error)
        }
    }),
    deleteCertificate: catchAsync(async (req, res) => {
        try {
            const id = req.params.id;
            const certificate = await cerficateService.deleteCertificate({ id });
            return res.status(200).json({
                message: "Certificate deleted successfully",
                data: certificate
            });
        } catch (error) {
            console.log(error)
        }
    }),
    downloadCertificate: catchAsync(async (req, res) => {
        try {
            const certificateId = req.params.certificateId;
            const certificateResponse = await cerficateService.downloadCertificate(certificateId);
            if (typeof certificateResponse === 'object' && 'error' in certificateResponse) {
                return res.status(404).json({ error: certificateResponse.error });
            }
            return res.status(200).json({
                message: "Certificate downloaded successfully",
                data: certificateResponse
            });
        } catch (error) {
            console.log(error)
        }
    })
}

export default certificateController;
