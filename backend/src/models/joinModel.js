const mongoose=require('mongoose')

const joinSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true
    },
    email:{
       type:String,
       require:true,
       trim:true
    },
    number:{
       type:String,
       require:true,
       trim:true
    },
    course:{
        type:String,
        require:true,
        trim:true
    },
    leadSource:{
        type:String,
        require:true,
        trim:true
    }
})

const Join=mongoose.model('Join',joinSchema)
module.exports=Join