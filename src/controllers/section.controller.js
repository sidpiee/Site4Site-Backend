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
export {addSection ,deleteSection , getSection};
