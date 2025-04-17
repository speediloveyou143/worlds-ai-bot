
// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/contactModel');
const {userAuth}=require('../middlewares/auth')
const {adminAuth}=require("../middlewares/admin")

// Create a new contact entry
router.post('/create-contact',userAuth,adminAuth, async (req, res) => {
  try {
    const { offer, heading, tag, insta, linkedin, youtube, channel, maps, group, email, number, address, logo } = req.body;

    if (!offer || !heading || !tag || !insta || !linkedin || !youtube || !channel || !maps || !group || !email || !number || !address || !logo) {
      return res.status(422).json({ message: "All fields are required..." });
    }

    const contact = new Contact({
      offer,
      heading,
      tag,
      insta,
      linkedin,
      youtube,
      channel,
      maps,
      group,
      email,
      number,
      address,
      logo,
    });

    await contact.save();
    res.status(200).json({ message: "Contact created successfully!", contact });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all contact entries
router.get('/all-contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific contact by ID
router.get('/show-contact/:id',userAuth,adminAuth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a contact by ID
router.put('/update-contact/:id',userAuth,adminAuth, async (req, res) => {
  try {
    const { offer, heading, tag, insta, linkedin, youtube, channel, maps, group, email, number, address, logo } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        offer,
        heading,
        tag,
        insta,
        linkedin,
        youtube,
        channel,
        maps,
        group,
        email,
        number,
        address,
        logo,
      },
      { new: true } // Return the updated document
    );

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact updated successfully!", contact });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a contact by ID
router.delete('/delete-contact/:id',userAuth,adminAuth,async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;