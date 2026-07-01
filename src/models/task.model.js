import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        userId : {
            required : true,
            type : String ,
        },
        id : {
            required : true,
            type : String,
        },
        text : {
            type : String ,
            required : true,
        },
        completed : {
            required : true,
            type : Boolean ,
            default : false,
        },
    },{
        timestamps : true,
    }
)
taskSchema.index(
  { userId: 1, id: 1 },
  { unique: true }
);
export const Task = mongoose.model("Task" , taskSchema);