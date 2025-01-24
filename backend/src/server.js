const express=require('express')
const connectDb=require('./config/mongoDbConnection')
const authRoutes=require('./routes/authRoutes')
const profileRoutes=require('./routes/profileRoutes')
const courseRoutes=require("./routes/courseRoutes")
const roadMapRoutes=require('./routes/roadMapRoutes')
const joinerRoutes=require('./routes/joinRoutes')
const recordingRoutes=require('./routes/recordingRoutes')
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


app.listen(4000,()=>{
    console.log("the server running in",4000)
})
