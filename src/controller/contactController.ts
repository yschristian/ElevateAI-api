import contactService from "../services/contactService";
import catchAsync from "../helper/catchAsync";

const contactController = {
  // Create a new contact
  createContact: catchAsync(async (req, res) => {
    try {
      const { email, FullName, phone, message,subject } = req.body;
      const response = await contactService.createContact({
        email,
        FullName,
        phone,
        message,
        subject
      });
      return res.status(201).json({
        message: "Message sent successfully",
        data: response,
      });
    } catch (error:any) {
      console.log("Error creating contact:", error);
      return res.status(400).json({
        message: "An error occurred while creating contact",
        error: error.message,
      });
    }
  }),

  // Get all contacts
  getAllContacts: catchAsync(async (req, res) => {
    try {
      const contacts = await contactService.getAllContact();
      return res.status(200).json({
        message: "Contacts fetched successfully",
        data: contacts,
      });
    } catch (error:any) {
      console.log("Error fetching contacts:", error);
      return res.status(500).json({
        message: "An error occurred while fetching contacts",
        error: error.message,
      });
    }
  }),

  // Get a single contact by ID
  getContactById: catchAsync(async (req, res) => {
    try {
      const { id } = req.params;
      const contact = await contactService.getById(id)
      
      return res.status(200).json({
        message: "Contact fetched successfully",
        data: contact,
      });
    } catch (error:any) {
      console.log("Error fetching contact:", error);
      return res.status(500).json({
        message: "An error occurred while fetching contact",
        error: error.message,
      });
    }
  }),

  // Update a contact by ID
  updateContact: catchAsync(async (req, res) => {
    try {
      const { id } = req.params;
      const { email, FullName, phone, message } = req.body;
      const updatedContact = await contactService.createContact({
        where: { id },
        data: { email, FullName, phone, message },
      });
      if (!updatedContact) {
        return res.status(404).json({
          message: "Contact not found",
        });
      }
      return res.status(200).json({
        message: "Contact updated successfully",
        data: updatedContact,
      });
    } catch (error:any) {
      console.log("Error updating contact:", error);
      return res.status(400).json({
        message: "An error occurred while updating contact",
        error: error.message,
      });
    }
  }),

};

export default contactController;