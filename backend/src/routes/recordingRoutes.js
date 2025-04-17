const express = require("express");
const Recordings = require("../models/recordingModel");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const {adminAuth}=require("../middlewares/admin")
const {paymentAuth}=require("../middlewares/payment")


router.post("/create-recordings",userAuth,adminAuth, async (req, res) => {
  try {
    const { batchNumber, recordings } = req.body;

    if (!batchNumber || !recordings || recordings.length === 0) {
      return res.status(422).json({ message: "Please fill all the fields" });
    }

    const newRecordings = new Recordings({ batchNumber, recordings });
    await newRecordings.save();
    res.status(200).json({ message: "Recording added successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
});

router.get("/show-recordings",userAuth,adminAuth, async (req, res) => {
  try {
    const recordings = await Recordings.find();
    if (recordings.length === 0) {
      return res.status(404).json({ message: "No recordings found" });
    }
    res.status(200).json({ data: recordings });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
});
router.get("/show-recordings/:id",userAuth,paymentAuth, async (req, res) => {
  try {
    const RecordingsData = await Recordings.findById(req.params.id);
    if (!RecordingsData) {
      return res.status(404).json({ message: "recordings not found" });
    }
    res.status(200).json(RecordingsData);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error retrieving recordings", error: err });
  }
});

router.put("/update-recordings/:id",userAuth,adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(422).json({ message: "ID is required" });
    }

    if (!req.body.batchNumber && !req.body.recordings) {
      return res
        .status(422)
        .json({ message: "At least one field is required to update" });
    }
    const updatedRecordings = await Recordings.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedRecordings) {
      return res.status(404).json({ message: "Recordings not found" });
    }

    res.status(200).json({
      message: "Recordings updated successfully",
      data: updatedRecordings,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ message: "Invalid ID format", error: err.message });
    }
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
});

router.delete("/delete-recordings/:id",userAuth,adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(422).json({ message: "id not found" });
    }
    const deleteRecordings = await Recordings.findByIdAndDelete(id);
    if (!deleteRecordings) {
      return res.status(422).json({ message: "recordings not deleted" });
    }
    res.status(200).json({ message: "recordings deleted" });
  } catch (err) {
    res.status(500).json({ message: "something went wrong", error: err });
  }
});

module.exports = router;
