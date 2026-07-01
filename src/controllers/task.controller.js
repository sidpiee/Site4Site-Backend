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
      res.status(200).json(new APIResponse(200 , data , "User-Game fetched successfully"));
})
export {addTask , getTask};