import mongoose from "mongoose";
import { APIResponse } from "../utils/api-response.js";
import { APIError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Section } from "../models/section.model.js";
import { Site } from "../models/site.model.js";

const findOwnedSection = async (sectionId, userId) => {
  if (!mongoose.isObjectIdOrHexString(sectionId)) {
    throw new APIError(400, "Invalid section ID");
  }

  const section = await Section.findOne({
    _id: sectionId,
    userId,
  });

  if (!section) {
    throw new APIError(404, "Section not found");
  }

  return section;
};

const addSection = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title?.trim()) {
    throw new APIError(400, "Title cannot be empty");
  }

  const section = await Section.create({
    title: title.trim(),
    description,
    userId: req.user.id,
  });

  res
    .status(201)
    .json(new APIResponse(201, section, "Section added successfully"));
});

const deleteSection = asyncHandler(async (req, res) => {
  const section = await findOwnedSection(req.params.id, req.user.id);

  await Site.deleteMany({ sectionId: section._id });
  await Section.deleteOne({
    _id: section._id,
    userId: req.user.id,
  });

  res
    .status(200)
    .json(new APIResponse(200, section, "Section deleted successfully"));
});

const getSection = asyncHandler(async (req, res) => {
  const sections = await Section.aggregate([
    {
      $match: {
        userId: req.user.id,
      },
    },
    {
      $lookup: {
        from: "sites",
        localField: "_id",
        foreignField: "sectionId",
        as: "sites",
      },
    },
  ]);

  res
    .status(200)
    .json(new APIResponse(200, sections, "User sections fetched successfully"));
});

const addSite = asyncHandler(async (req, res) => {
  const section = await findOwnedSection(req.params.id, req.user.id);
  const { name, url, note } = req.body;

  if (!name?.trim() || !url?.trim()) {
    throw new APIError(400, "Name and URL cannot be empty");
  }

  const site = await Site.create({
    name: name.trim(),
    url: url.trim(),
    note,
    sectionId: section._id,
  });

  res.status(201).json(new APIResponse(201, site, "Site added successfully"));
});

const deleteSite = asyncHandler(async (req, res) => {
  const { sectionId, id } = req.params;
  const section = await findOwnedSection(sectionId, req.user.id);

  if (!mongoose.isObjectIdOrHexString(id)) {
    throw new APIError(400, "Invalid site ID");
  }

  const site = await Site.findOneAndDelete({
    sectionId: section._id,
    _id: id,
  });

  if (!site) {
    throw new APIError(404, "Site not found");
  }

  res
    .status(200)
    .json(new APIResponse(200, site, "Site deleted successfully"));
});

const updateSection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!mongoose.isObjectIdOrHexString(id)) {
    throw new APIError(400, "Invalid section ID");
  }
  if (!title?.trim()) {
    throw new APIError(400, "Title cannot be empty");
  }

  const section = await Section.findOneAndUpdate(
    {
      _id: id,
      userId: req.user.id,
    },
    {
      title: title.trim(),
      description,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!section) {
    throw new APIError(404, "Section not found");
  }

  res
    .status(200)
    .json(new APIResponse(200, section, "Section updated successfully"));
});

const updateSite = asyncHandler(async (req, res) => {
  const { sectionId, id } = req.params;
  const section = await findOwnedSection(sectionId, req.user.id);
  const { name, url, note } = req.body;

  if (!mongoose.isObjectIdOrHexString(id)) {
    throw new APIError(400, "Invalid site ID");
  }
  if (!name?.trim() || !url?.trim()) {
    throw new APIError(400, "Name and URL cannot be empty");
  }

  const site = await Site.findOneAndUpdate(
    {
      _id: id,
      sectionId: section._id,
    },
    {
      name: name.trim(),
      url: url.trim(),
      note,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!site) {
    throw new APIError(404, "Site not found");
  }

  res
    .status(200)
    .json(new APIResponse(200, site, "Site updated successfully"));
});

export {
  addSection,
  deleteSection,
  getSection,
  addSite,
  deleteSite,
  updateSection,
  updateSite,
};
