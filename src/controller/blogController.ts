import blogService from "../services/blogServices";
import catchAsync from "../helper/catchAsync";
import { Request } from "express";
import cloudinary from "../helper/cloudImag"
interface CustomRequest extends Request {
    user: any;
}

const blogController = {
    createBlog: catchAsync(async (req, res) => {
        try {
            const { title, content } = req.body;
            const result = await cloudinary.uploader.upload(req.file?.path ?? "")
            const userId = (req as CustomRequest).user.id;

            const newCourse = await blogService.createblog({
                title,
                content,
                imageUrl: result.secure_url,
                userId
            });
            return res.status(201).json({
                message: "blog created successfully",
                data: newCourse,
            })
        } catch (error: any) {
            console.log("eeee.....", error)
            return res.status(400).json({
                message: "An error occurred, in creating blog",
                error: error.message
            })
        }
    }),
    getAllblogs: catchAsync(async (req, res) => {
        try {
            const courses = await blogService.getAllblogs();
            return res.status(200).json({
                message: "All blogs",
                data: courses,
            });
        } catch (error) {
            console.log(error)
        }
    }),

    getBlogLength: catchAsync(async (req, res) => {
        try {
            const courses = await blogService.getAllblogs();
            const number = courses.length
            return res.status(200).json({
                message: "All blogs",
                data: number,
            });
        } catch (error) {
            console.log(error)
        }
    }),
   
    getBlogById: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            const blog = await blogService.getblogById({ id });
            if (!blog) {
                return res.status(404).json({
                    message: "Blog not found",
                });
            }
            return res.status(200).json({
                message: "Blog found",
                data: blog,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }),
    updateBlog: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            const { title, content } = req.body;
            const result = await cloudinary.uploader.upload(req.file?.path ?? "")
            const updatedBlog = await blogService.updateblog(
                { id },
                {
                    title,
                    content,
                    imageUrl: result.secure_url,
                }
            );
            return res.status(200).json({
                message: "Blog updated successfully",
                data: updatedBlog,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }),
    deleteBlog: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            await blogService.deleteblog({ id });
            return res.status(200).json({
                message: "Blog deleted successfully",
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }),
}

export default blogController;
