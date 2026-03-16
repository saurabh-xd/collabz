import mongoose from "mongoose";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";

const allowedStatuses = ["todo", "in-progress", "done"];

const validateStatus = (status) =>
  !status || allowedStatuses.includes(status);

const ensureValidObjectId = (value, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    const error = new Error(`Invalid ${fieldName}`);
    error.statusCode = 400;
    throw error;
  }
};

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, assignedTo } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });
  }

  if (!validateStatus(status)) {
    return res.status(400).json({
      success: false,
      message: "Status must be one of todo, in-progress, or done",
    });
  }

  if (assignedTo) {
    ensureValidObjectId(assignedTo, "assignedTo user id");

    const assignee = await User.findById(assignedTo);
    if (!assignee) {
      return res.status(404).json({
        success: false,
        message: "Assigned user not found",
      });
    }
  }

  const task = await Task.create({
    title: title.trim(),
    description: description?.trim() || "",
    status: status || "todo",
    assignedTo: assignedTo || null,
    createdBy: req.user.id,
  });

  const populatedTask = await task.populate([
    { path: "assignedTo", select: "name email" },
    { path: "createdBy", select: "name email" },
  ]);

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: populatedTask,
  });
});

export const getTasks = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 10 } = req.query;
  const filter = {};

  if (status) {
    if (!validateStatus(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be one of todo, in-progress, or done",
      });
    }

    filter.status = status;
  }

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.max(Number(limit) || 10, 1);
  const skip = (pageNumber - 1) * limitNumber;

  const [tasks, totalTasks] = await Promise.all([
    Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber),
    Task.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: tasks,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total: totalTasks,
      totalPages: Math.ceil(totalTasks / limitNumber),
    },
  });
});

export const getTask = asyncHandler(async (req, res) => {
  ensureValidObjectId(req.params.id, "task id");

  const task = await Task.findById(req.params.id)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  ensureValidObjectId(req.params.id, "task id");

  const { title, description, status, assignedTo } = req.body;
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  if (task.createdBy.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "You can only update tasks you created",
    });
  }

  if (status && !validateStatus(status)) {
    return res.status(400).json({
      success: false,
      message: "Status must be one of todo, in-progress, or done",
    });
  }

  if (assignedTo) {
    ensureValidObjectId(assignedTo, "assignedTo user id");

    const assignee = await User.findById(assignedTo);
    if (!assignee) {
      return res.status(404).json({
        success: false,
        message: "Assigned user not found",
      });
    }
  }

  if (title !== undefined) {
    task.title = title.trim();
  }

  if (description !== undefined) {
    task.description = description.trim();
  }

  if (status !== undefined) {
    task.status = status;
  }

  if (assignedTo !== undefined) {
    task.assignedTo = assignedTo || null;
  }

  await task.save();
  await task.populate([
    { path: "assignedTo", select: "name email" },
    { path: "createdBy", select: "name email" },
  ]);

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: task,
  });
});

export const deleteTask = asyncHandler(async (req, res) => {
  ensureValidObjectId(req.params.id, "task id");

  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  if (task.createdBy.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "You can only delete tasks you created",
    });
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
});
