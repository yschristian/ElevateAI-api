import multer from "multer"
import path from "path"

const uploadImage = multer({

    storage: multer.diskStorage({}),

    // filename: (req: any, file: any, cb: any) => {
    //     cb(null, new Date().toISOString() + file.originalname);
    // },
   
    fileFilter: (req, file, cb: any) => {
        let ext = path.extname(file.originalname).toLocaleLowerCase()
        if (ext !== '.jpeg' && ext !== '.jpg' && ext !== '.png') {
            cb(new Error('unsupported format'), false)
            return
        }
        cb(null, true)
    }
});

export default uploadImage;
