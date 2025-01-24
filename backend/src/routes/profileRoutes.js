const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User=require('../models/userModel')
const router = express.Router();

router.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.json("user not found");
    }
    return res.json(user);
  } catch (err) {
    return res.json("user is not found", err);
  }
});

router.get('/show-profiles',async(req,res)=>{
 try{ const response=await User.find()
  if(!response){
    return res.status(400).json({message:"records not found"})
  }
  res.status(200).json({message:"all users",data:response})}
  catch(err){
    res.status(500).json({message:"something went wrong",error:err})
  }
})

router.get("/show-user/:id", async (req, res) => {
  try {
    const UserData = await User.findById(req.params.id);
    if (!UserData) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json(UserData);
  } catch (err) {
    res.status(400).json({ message: "Error retrieving User", error: err });
  }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
try {
    const { name, universityName, number } = req.body;
    const loggedInUser = req.user;
    if (!name || !universityName|| !number) {
      res.json({ message: "please provide both the fields" });
    }
    loggedInUser.name = name;
    loggedInUser.university = universityName;
    loggedInUser.number = number;
    await loggedInUser.save();
    res.status(200).json({message:"profile updated"});
  } catch (err) {
    res.status(401).json({
      message: "error while uploading please contact admin team",
      error: err,
    });
  }
});

router.put('/update-user/:id', async (req, res) => {
  console.log(req.params.id);
  console.log(req.body);

  try {
    const userId = req.params.id;
    const updateData = req.body;

    // Fetch the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Replace the courses field if it exists in the updateData
    if (updateData.courses) {
      user.courses = updateData.courses; // Replace instead of appending
    }

    // Update other fields in the user document
    Object.keys(updateData).forEach((key) => {
      if (key !== 'courses') {
        user[key] = updateData[key];
      }
    });

    // Save the updated user document
    const updatedUser = await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating user',
      error: error.message,
    });
  }
});



router.delete("/delete-profile/:id",async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(422).json({ message: "id not found" });
    }
    const deleteJoin = await User.findByIdAndDelete(id);
    if (!deleteJoin) {
      return res.status(404).json({ message: "record not found" });
    }
    res.status(200).json({ message: "record deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "something went wrong with delete", error: err });
  }
});

module.exports = router;
