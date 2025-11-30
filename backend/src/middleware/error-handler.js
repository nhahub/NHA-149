export const notFound = (req, res, next) => {
  throw new Error(`Not Found - ${req.originalUrl}`, { cause: 404 });
};
