const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true,
        default: "student"
    },
  
    batchNumber: {
        type: Number, 
        required: true,
        default: 10
    },
    pCertificates: {
        type: [
            {
                name: { type: String,default:"Worlds Ai Bot"},
                status: { type: Boolean, default: false },
                startDate: { type: String, default: "day-Month-Year" },
                endDate: { type: String, default: "day-Month-Year" },
                courseName: { type: String ,default:"Python full stack web development"}
            }
        ],
        default: []
    },
    iCertificates: {
        type: [
            {
                name: { type: String,default:"Worlds Ai Bot"},
                status: { type: Boolean, default: false },
                startDate: { type: String, default: "day-Month-Year" },
                endDate: { type: String, default: "day-Month-Year" },
                courseName: { type: String ,default:"Python full stack web development"}
            }
        ],
        default: []
    },
    cCertificates: {
        type: [
            {
                name: { type: String,default:"Worlds Ai Bot"},
                status: { type: Boolean, default: false },
                startDate: { type: String, default: "day-Month-Year" },
                endDate: { type: String, default: "day-Month-Year" },
                courseName: { type: String ,default:"Python full stack web development"}
            }
        ],
        default: []
    },
    
    
    courses: {
        type: [
            {
                transactionId: { type: String },
                amount: { type: Number },
                status: { type: Boolean,default:false },
                courseName: { type: String },
                email: { type: String },
                name: { type: String },
                recordingsId: { type: String,default:"12345"},
            }
        ],
        default: []
    },
    university: {
        type: String,
        trim: true,
        default: "worldsaibot"
    }
});

// Create the User Model
const User = mongoose.model('User', userSchema);

module.exports = User;
