import { APIResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

// const healthcheck = (req, res) => {
//   try {
//     res
//       .status(200)
//       .json(new APIResponse(200, { message: "SERVER is RUNNING" }));
//   } catch (error) {}
// };

const healthcheck = asyncHandler(async (req, res) => {
  res.status(200).json(new APIResponse(200, { message: "Server is running" }));
});

export { healthcheck };
