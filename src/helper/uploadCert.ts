import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { config } from '../config/config';

cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret,
})

export const uploadCertificate = (pdfBuffer: Buffer, certificateId: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            resource_type: 'raw',
            public_id: `certificates/certif-${certificateId}`,
            format: 'pdf'
        }, (error, result: any) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                return reject(error);
            }
            resolve(result.secure_url);
        });
        streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
    });
};
