const mongoose=require('mongoose')

const recordingsSchema = new mongoose.Schema({
    batchNumber: {
      type: Number,
      required: true,
    },
    recordings: [
      {
        videoUrl: { type: String, required: true },
        videoTitle: { type: String, required: true },
      },
    ],
  });
  

const Recordings=new mongoose.model('Recordings',recordingsSchema)
module.exports=Recordings