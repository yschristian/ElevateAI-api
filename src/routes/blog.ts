import express from "express";
import uploadImage from "../helper/uplaodImage";
import blogController from "../controller/blogController";
import { isAdmin } from "../middleware/isLoggedin";

const router = express.Router();
router.post("/create", isAdmin, uploadImage.single("imageUrl"), blogController.createBlog)
        .get("/all", blogController.getAllblogs)    
        .get("/number",isAdmin,blogController.getBlogLength)
        .get("/single/:id", blogController.getBlogById)
        .put("/update/:id", isAdmin, uploadImage.single("imageUrl"), blogController.updateBlog)
        .delete("/delete/:id", isAdmin, blogController.deleteBlog);
export default router;