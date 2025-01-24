const express = require("express");
const Join = require("../models/joinModel");
const router = express.Router();

router.post("/create-join", async (req, res) => {
  const { name, number, email, course, leadSource } = req.body;
  try {
    if ((!name || !number, !email || !course || !leadSource)) {
      return res.status(422).json({ message:"require all the fields"});
    }
    const join = new Join({
      name,
      number,
      email,
      course,
      leadSource,
    });
    await join.save();
    res.status(201).json({ message: "thanks for completing registration" });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "something went wrong please try again later",
        error: err,
      });
  }
});

router.delete("/delete-join/:id",async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(422).json({ message: "id not found" });
    }
    const deleteJoin = await Join.findByIdAndDelete(id);
    if (!deleteJoin) {
      return res.status(404).json({ message: "record not found" });
    }
    res.status(201).json({ message: "record deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "something went wrong with delete", error: err });
  }
});

router.get('/show-joiners',async(req,res)=>{
   try{const response=await Join.find()
   if(!response){
    return res.status(400).json({message:"records not found"})
   }
   res.status(200).json({message:"all joiners",data:response})}
   catch(err){
    res.status(500).json({message:"something went wrong",error:err})
   }

})

module.exports = router;
