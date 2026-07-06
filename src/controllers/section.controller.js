import { APIResponse } from "../utils/api-response.js";
import { APIError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Section } from "../models/section.model.js";
import { Site } from "../models/site.model.js";

const addSection = asyncHandler(async(req , res)=> {
    const s = await Section.create({
        ...req.body ,
        userId : req.user.id,
    })
    res.status(200).json(new APIResponse(200 , s , "Section added successfully"));
});

const deleteSection = asyncHandler(async(req,res) => {
    const {id} = req.params;
    const s = await Section.findOneAndDelete({
        userId : req.user.id,
        _id : id,
    })
    const site = await Site.deleteMany({
        sectionId : id,
    })
    if(!s) throw new APIError(404 , "Section not found");
    res.status(200).json(new APIResponse(200 , s , "Section deleted successfully"));
});
const getSection = asyncHandler(async(req,res)=> {
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

res.status(200).json(new APIResponse(200 , sections , "User-Game fetched successfully"));

})

const addSite = asyncHandler(async (req, res) => {
  const {id} = req.params;
  const s = Site.create({
    ...req.body ,
    sectionId : id,
  });
  res.status(200).json(new APIResponse(200 , s , "Site added successfully"));
})
const deleteSite = asyncHandler(async(req,res)=> {
  const {sectionId , id } = req.params;
  const s = await Site.findOneAndDelete({
    sectionId , 
    _id : id,
  })
  if (!s) {
  throw new APIError(404, "Site not found");
}
  res.status(200).json(new APIResponse(200 , s , "Site deleted successfully"));
})
const updateSection = asyncHandler(async(req , res) => {
  const {id} = req.params;
  const {title , description} = req.body;
  if(!title) throw new APIError(400 , "Title cannot be empty");
  const s = await Section.findOneAndUpdate({
    _id : id ,
    userId : req.user.id,
  }, {
    title , description
  } , {new : true ,  runValidators: true,});
  res.status(200).json(new APIResponse(200 , s , "Section updated succcessfully"));
})
const updateSite = asyncHandler(async(req,res) => {
  const {sectionId , id} = req.params;
  const section = await Section.findOne({
  _id: sectionId,
  userId: req.user.id,
});

if (!section)
  throw new APIError(404, "Section not found");
  const {name , url , note} = req.body;
  if(!name || !url) throw new APIError(400 , "Name or Url cannot be empty");
  const s = await Site.findOneAndUpdate({
    _id : id ,
    sectionId
  } , {
    name , url  , note
  } ,{ new : true ,  runValidators: true,})
  res.status(200).json(new APIResponse(200 , s , "Site updated succcessfully"));
})

export {addSection ,deleteSection , getSection , addSite , deleteSite , updateSection , updateSite};
