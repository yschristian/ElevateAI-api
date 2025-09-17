import cerficateService from "../services/certificateService";
import catchAsync from "../helper/catchAsync";
import { Request } from "express";
import prisma from "../client";

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
    getNumberOfCertificates: catchAsync(async (req, res) => {
        try {
            const certificates = await cerficateService.getAllCertificates();
            if (!certificates) return res.status(404).json({ error: "No certificates found" });
            return res.status(200).json({
                message: "Number of certificates fetched successfully",
                data: certificates.length
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
    getNumberCertificateByUserId: catchAsync(async (req, res) => {
        try {
            const userId = (req as CustomRequest).user.id;
            const certificates = await cerficateService.getCeritificateById({ userId });
            if (!certificates) return res.status(404).json({ error: "No certificate!", });
            return res.status(200).json({
                message: "Certificate fetched successfully",
                data: certificates.length
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
    
 downloadCertificate : catchAsync(async (req, res) => {
  try {
    const certificateId = req.params.certificateId;
    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
      include: { course: true }
    });

    if (!certificate) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    const originalUrl = certificate.urlOfCert;
    
    const urlVariations = [
      originalUrl,
      originalUrl.replace('/raw/upload/', '/image/upload/'),
      originalUrl.replace('https://res.cloudinary.com/', 'https://cloudinary-a.akamaihd.net/'),
      originalUrl.replace('/raw/upload/v', '/raw/upload/fl_attachment/v')
    ];

    for (const url of urlVariations) {      
      try {
        const response = await fetch(url);
        
        if (response.ok) {
        //   console.log(`Success with URL: ${url}`);
          const pdfArrayBuffer = await response.arrayBuffer();
          const pdfBuffer = Buffer.from(pdfArrayBuffer);
          
          res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${certificate.course.title.replace(/[^a-zA-Z0-9]/g, '_')}_Certificate.pdf"`,
            'Content-Length': pdfBuffer.length.toString(),
          });
          
          return res.send(pdfBuffer);
        }
      } catch (urlError:any) {
        console.log(`Failed with URL ${url}:`, urlError.message);
        continue;
      }
    }
        return res.status(502).json({ error: "Certificate file is not accessible" });
    
  } catch (error) {
    console.error('Download certificate error:', error);
    return res.status(500).json({ error: "Failed to download certificate" });
  }
}),
}

export default certificateController;
