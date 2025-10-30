import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/dbConfig.js'
import experiencesRoute from './Routes/experiencesRoute.js'

dotenv.config()

const app = express()
const port = process.env.PORT

app.use(cors({
  origin:["http://localhost:5173", "https://highway-delite-frontend-xc2t.onrender.com"],
  credentials:true
}))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use("/uploads", express.static("uploads"));

app.use('/api', experiencesRoute)

app.listen(port,()=>{
  console.log(`Listening to port ${port}`)
  connectDB();
})