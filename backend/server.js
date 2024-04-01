import express from "express";
import dotenv from "dotenv";
dotenv.config({path:".env"})
import mongoose from "mongoose";
import cors from "cors";
import Activity from "./models/activity.models.js";
// console.log(process.env)
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Connected to MongoDB"))
.catch((err)=> console.log(err))


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());


app.post('/api/v1/addActivity',async (req, res) => {
    try {
        const {task, deadline,status} = req.body;
        const activity = new Activity({
            task,
            deadline,
            status
        })
        await activity.save()
        res.status(201).json(activity)
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Server error"})
    }
})

app.get('/api/v1/getActivities',async (req, res) => {
    try {
        const activities = await Activity.find()
        res.status(200).json(activities)
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Server error"})
    }
})

app.post('/api/v1/updateStatus',async (req, res) => {
    try {
        const {id,status} = req.body;
        const activity = await Activity.findById(id)
        activity.status = status;
        await activity.save({validateBeforeSave:false})
        res.status(200).json(activity)
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Server error"})
    }
})

app.post('/api/v1/performance',async (req, res) => {
    try {
        const activities = await Activity.find()
        const completedActivities = activities.filter(activity => activity.status === "Completed")
        let badge = "none";
        if(completedActivities.length === 0){
            badge = "none"
        }else if(completedActivities.length > 0 && completedActivities.length <= 3){
            badge = "bronze"
        }else if(completedActivities.length > 3 && completedActivities.length <= 6){
            badge = "silver"
        }else if(completedActivities.length > 6){
            badge = "gold"
        }
        res.status(200).json({badge})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Server error"})
    }
})



app.listen(process.env.PORT, () => {
    console.log("Server is running on port",process.env.PORT)
})