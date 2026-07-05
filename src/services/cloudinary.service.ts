import { v2 as cloudinary } from 'cloudinary';
import { ApiError } from '../utils/apiError';

// The configuration expects the env variables to be set before calling these methods.
// In a real scenario, this gets evaluated when the file is imported, so ensure dotenv is loaded beforehand (which is usually the case in server.ts).
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
  /**
   * Uploads an image buffer to Cloudinary.
   * @param fileBuffer The file buffer from multer.
   * @param folder The folder to store the image in.
   * @returns The Cloudinary response containing secure_url and public_id.
   */
  static async uploadImage(fileBuffer: Buffer, folder: string = 'avatars'): Promise<{ secure_url: string; public_id: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          transformation: [{ width: 300, height: 300, crop: 'fill' }],
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error);
            return reject(new ApiError(500, 'Image upload failed'));
          }
          if (result) {
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        }
      );
      uploadStream.end(fileBuffer);
    });
  }

  /**
   * Deletes an image from Cloudinary by its public ID.
   * @param publicId The public ID of the image to delete.
   */
  static async deleteImage(publicId: string): Promise<void> {
    try {
      if (!publicId) return;
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Cloudinary Delete Error:', error);
      // We do not throw here, failing to delete an old image shouldn't block user flows
    }
  }
}
