import mongoose from "mongoose";
const activitySchema = mongoose.Schema({
    task:{
        type:String,
        required:true
    },
    deadline:{
        type:Date,
        default:Date.now()
    },
    status:{
        type:String,
        default:"In Progress"
    }
})

const Activity = mongoose.model('Activity',activitySchema);
export default Activity;