import { v2 as cloudinary } from "cloudinary";
import  {ApiError} from "./APIErrors.js";

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Cloudinary environment variables are missing");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const deleteFromCloudinary = async (publicId, resource_type = "image") => {
  if (!publicId) {
    throw new ApiError(400, "publicId is required for deletion");
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type,
    });

    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error(`Cloudinary deletion failed: ${result.result}`);
    }

    return result;
  } catch (error) {
    throw new ApiError(
      500,
      "Failed to delete asset from Cloudinary",
      error
    );
  }
};

export { deleteFromCloudinary };
