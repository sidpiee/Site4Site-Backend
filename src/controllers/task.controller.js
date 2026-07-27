import { APIResponse } from "../utils/api-response.js";
import { APIError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Task } from "../models/task.model.js";

const addTask = asyncHandler(async (req, res) => {
  const task = await Task.create({
    ...req.body,
    userId: req.user.id,
  });

  res
    .status(201)
    .json(new APIResponse(201, task, "Task added successfully"));
});

const getTask = asyncHandler(async (req, res) => {
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

  res
    .status(200)
    .json(new APIResponse(200, data, "User tasks fetched successfully"));
});

const toggleTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  if (typeof completed !== "boolean") {
    throw new APIError(400, "Completed must be a boolean");
  }

  const task = await Task.findOneAndUpdate(
    {
      id,
      userId: req.user.id,
    },
    {
      completed,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!task) {
    throw new APIError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new APIResponse(200, task, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
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

const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text?.trim()) {
    throw new APIError(400, "Text cannot be empty");
  }

  const task = await Task.findOneAndUpdate(
    {
      userId: req.user.id,
      id,
    },
    {
      text: text.trim(),
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!task) {
    throw new APIError(404, "Task not found");
  }

  res
    .status(200)
    .json(new APIResponse(200, task, "Task updated successfully"));
});

export { addTask, getTask, toggleTask, deleteTask, updateTask };
