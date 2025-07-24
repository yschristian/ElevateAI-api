import  multer from 'multer';
import path from 'path';
import fs from 'fs'
import { v2  } from "cloudinary" 
import { config } from "../config/config"

v2.config({ 
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret,
    })


const uploadDir = path.join(__dirname, 'uploads', 'videos');

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        cb(null, uploadDir);
    },
    filename: function (req: any, file: any, cb: any) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'video-' + uniqueSuffix + '-' + file.originalname);
    },
});

const fileFilter = function (req: any, file: any, cb: any) {
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only video files are allowed!'), false);
    }
};

export const uploadVideo = multer({
    storage: storage,
    fileFilter: fileFilter,
});

export const uploadToCloudinary = async (file:any) => {
    try {
      const uploadResponse = await v2.uploader.upload(file.path, {
        resource_type: "video",
        eager: [{ width: 300, height: 300, crop: "pad" }],
        eager_async: true,
      });
  
      const { secure_url } = uploadResponse;
      return secure_url;
    } catch (error) {
      throw error;
    }
  };

