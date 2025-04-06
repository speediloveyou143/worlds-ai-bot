const express=require('express')
const router=express.Router()
const Company=require('../models/companyModel')
router.post('/create-logo',async(req,res)=>{
    try{const{companyName,logo}=req.body
    if(!companyName || !logo){
      return res.status(422).json({ message: "All fields are required..." });
         
    }
    const company=new Company({
        companyName,logo
    })
    await company.save()
    res.status(200).json({message: "company logo created !!"});}
    catch (err) {
        return res.status(500).json({message: err});
    }
})
router.get('/show-companies', async (req, res) => {
    try {
        const companies = await Company.find();
        res.status(200).json(companies);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.get('/show-company/:id', async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        res.status(200).json(company);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.patch('/update-company/:id', async (req, res) => {
    try {
        const { companyName, logo } = req.body;
        const company = await Company.findByIdAndUpdate(req.params.id, { companyName, logo }, { new: true });
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        res.status(200).json(company);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.delete('/delete-company/:id', async (req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        res.status(200).json({ message: "Company deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

module.exports=router