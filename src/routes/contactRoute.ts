import express from "express";
import contactController from "../controller/contactController";
import { isAdmin } from "../middleware/isLoggedin";

const router = express.Router();
router.post("/send", contactController.createContact)
        .get("/all",isAdmin, contactController.getAllContacts)    
        .get("/single/:id", contactController.getContactById)
export default router;