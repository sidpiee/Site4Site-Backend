import { APIResponse } from "../utils/api-response.js";
import { APIError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Task } from "../models/task.model.js";

const addTask = asyncHandler(async(req , res) => {
    const t = await Task.create({
        ...req.body ,
        userId : req.user.id,
    })
    res.status(201).json(new APIResponse(201 , t , "Task added successfully")) ;
})
const getTask = asyncHandler(async(req,res)=> {
    const data = await Task.aggregate([
        {
          $match: {
            userId: req.user.id,
          },
        },
        {
          $sort: {
            updatedAt: -1,
          },
        },
      ]);
      res.status(200).json(new APIResponse(200 , data , "User-Task fetched successfully"));
})
const toggleTask = asyncHandler(async(req , res) => {
    const {id} = req.params ;
    const {completed} = req.body;
     const t = await Task.findOneAndUpdate(
      {
        id: id,
        userId: req.user.id,
      },
      {
        completed,
      },
      { new: true }
    );
    if (!t) {
      throw new APIError(404, "Task not updated");
    }
    return res.status(200).json(new APIResponse(200 , t , "Task updated successfuly"));
})
const deleteTask = asyncHandler(async(req,res) => {
    const {id} = req.params;
    const task = await Task.findOneAndDelete({
    id,
    userId: req.user.id,
  });

  if (!task) {
    throw new APIError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new APIResponse(200, task, "Task deleted successfully"));
});

export {addTask , getTask , toggleTask,deleteTask};