import { supabase } from "../lib/supabase.js";
import { APIError } from "../utils/api-error.js";
import {asyncHandler} from "../utils/async-handler.js"

export const requireAuth = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw new APIError(401, "Invalid access Token");
  }
  req.user = data.user;
  next();
});
  


