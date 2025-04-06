const mongoose = require("mongoose");

const roadMapTopicSchema = new mongoose.Schema({
  roadMapName: {
    type: String,
    required: true,
    trim: true,
  },
  id:{
    type: String,
    required: true,
    trim: true,
  }
 

});

const RoadMapTopic=mongoose.model('RoadMapTopic',roadMapTopicSchema)

module.exports=RoadMapTopic
