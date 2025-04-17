// routes/testRoutes.js
const express = require('express');
const router = express.Router();
const Test = require('../models/testModel');
const { userAuth } = require("../middlewares/auth");
const {adminAuth}=require("../middlewares/admin")

// Create a new test entry
router.post('/create-test',userAuth,adminAuth, async (req, res) => {
  try {
    const { question, test } = req.body;

    if (!question || !test || !Array.isArray(test) || test.length === 0) {
      return res.status(422).json({ message: "Question and at least one test case (input/output) are required..." });
    }

    // Validate each test case
    for (const item of test) {
      if (!item.input || !item.output) {
        return res.status(422).json({ message: "Each test case must have input and output..." });
      }
    }

    const testEntry = new Test({
      question,
      test,
    });

    await testEntry.save();
    res.status(200).json({ message: "Test created successfully!", test: testEntry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all test entries
router.get('/all-tests',userAuth, async (req, res) => {
  try {
    const tests = await Test.find();
    res.status(200).json(tests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific test by ID
router.get('/show-test/:id',userAuth,adminAuth, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.status(200).json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a test by ID
router.put('/update-test/:id',userAuth,adminAuth, async (req, res) => {
  try {
    const { question, test } = req.body;

    if (!question || !test || !Array.isArray(test) || test.length === 0) {
      return res.status(422).json({ message: "Question and at least one test case (input/output) are required..." });
    }

    // Validate each test case
    for (const item of test) {
      if (!item.input || !item.output) {
        return res.status(422).json({ message: "Each test case must have input and output..." });
      }
    }

    const testEntry = await Test.findByIdAndUpdate(
      req.params.id,
      { question, test },
      { new: true } // Return the updated document
    );

    if (!testEntry) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.status(200).json({ message: "Test updated successfully!", test: testEntry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a test by ID
router.delete('/delete-test/:id',userAuth,adminAuth, async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.status(200).json({ message: "Test deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;