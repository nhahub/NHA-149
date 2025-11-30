// Export all middleware from a single entry point
export { authenticate, optionalAuthenticate } from "./authentication.js";
export { authorize } from "./authorization.js";
export { notFound } from "./error-handler.js";
export { validation } from "./validation.js";
