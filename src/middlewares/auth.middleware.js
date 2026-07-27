import { supabase } from "../lib/supabase.js";
import { APIError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

export const requireAuth = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    throw new APIError(401, "Authentication required");
  }

  const token = authorization.slice("Bearer ".length).trim();
  if (!token) {
    throw new APIError(401, "Authentication required");
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    throw new APIError(401, "Invalid access token");
  }

  req.user = data.user;
  next();
});
