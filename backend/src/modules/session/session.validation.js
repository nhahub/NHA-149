import { generalRules } from "../../utils/validation-rules.js";

// Schema for session ID in params
export const sessionIdSchema = {
  params: generalRules.paramsWithId("Session ID"),
};
