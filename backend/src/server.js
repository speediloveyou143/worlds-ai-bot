const express=require('express')
const connectDb=require('./config/mongoDbConnection')
const authRoutes=require('./routes/authRoutes')
const profileRoutes=require('./routes/profileRoutes')
const courseRoutes=require("./routes/courseRoutes")
const roadMapRoutes=require('./routes/roadMapRoutes')
const joinerRoutes=require('./routes/joinRoutes')
const companyRoutes=require('./routes/companyRoutes')
const recordingRoutes=require('./routes/recordingRoutes')
const successVideoRoutes=require('./routes/successVideosRoutes')
const privacyRoutes=require('./routes/privacyRoutes')
const registerRoutes=require('./routes/registerRoutes')
const bootcampRoutes=require('./routes/bootcampRoutes')
const roadMapTopicRoutes=require('./routes/roadMapTopicRoutes')
const contactRoutes=require('./routes/contactRoutes')
const jobRoutes=require('./routes/jobRoutes')
const testRoutes=require('./routes/testRoutes')
const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')
const cors=require('cors')


const app=express()

connectDb()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials:true,

}))
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(authRoutes)
app.use(profileRoutes)
app.use(courseRoutes)
app.use(roadMapRoutes)
app.use(joinerRoutes)
app.use(recordingRoutes)
app.use(companyRoutes)
app.use(successVideoRoutes)
app.use(privacyRoutes)
app.use(registerRoutes)
app.use(bootcampRoutes)
app.use(roadMapTopicRoutes)
app.use(jobRoutes)
app.use(contactRoutes)
app.use(testRoutes)
app.listen(4000,()=>{
    console.log("the server running in",4000)
})
