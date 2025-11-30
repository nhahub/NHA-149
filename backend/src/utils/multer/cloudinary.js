import { v2 as cloudinary } from "cloudinary";

export const cloud = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  return cloudinary;
};

export const uploadFile = async ({ file, filePath = "general", resourceType = "auto" }) => {
  // Determine resource type based on file mimetype if not specified
  let uploadResourceType = resourceType;
  if (resourceType === "auto" && file.mimetype) {
    if (file.mimetype.startsWith("image/")) {
      uploadResourceType = "image";
    } else if (
      file.mimetype.includes("pdf") ||
      file.mimetype.includes("document") ||
      file.mimetype.includes("msword") ||
      file.mimetype.includes("wordprocessingml")
    ) {
      uploadResourceType = "raw";
    } else if (file.mimetype.startsWith("video/")) {
      uploadResourceType = "video";
    }
  }

  return await cloud().uploader.upload(file.path, {
    folder: `${process.env.CLOUDINARY_FOLDER || "taqyeem"}/${filePath}`,
    resource_type: uploadResourceType,
    access_mode: "public", // Ensure files are publicly accessible
  });
};

export const uploadFiles = async ({ files, filePath = "general" }) => {
  let attachments = [];
  for (const file of files) {
    const { secure_url, public_id } = await uploadFile({
      file,
      filePath,
    });
    attachments.push({ secure_url, public_id });
  }
  return attachments;
};

export const destroyFile = async ({ publicId = "" } = {}) => {
  return await cloud().uploader.destroy(publicId);
};

export const destroyFiles = async ({ publicIds = [], options } = {}) => {
  return await cloud().api.delete_resources(publicIds, options);
};

export const deleteFolderByPrefix = async ({ prefix = "" } = {}) => {
  return await cloud().api.delete_resources_by_prefix(
    `${process.env.CLOUDINARY_FOLDER || "taqyeem"}/${prefix}`
  );
};
