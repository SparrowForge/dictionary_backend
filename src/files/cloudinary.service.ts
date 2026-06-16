import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export interface CloudinaryUploadResult {
  public_id: string;
  url: string;
  secure_url: string;
  resource_type: string;
}

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private readonly configService: ConfigService) {
    this.initializeCloudinary();
  }

  private initializeCloudinary() {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    folder?: string,
  ): Promise<CloudinaryUploadResult> {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            public_id: fileName,
            folder: folder || this.configService.get<string>('CLOUDINARY_FOLDER') || 'dictionary',
            resource_type: 'auto',
            use_filename: true,
            unique_filename: true,
            overwrite: false,
          },
          (error, result) => {
            if (error) {
              this.logger.error(
                `Error uploading file to Cloudinary: ${error.message}`,
                error.stack,
              );
              reject(new Error(`Failed to upload file to Cloudinary: ${error.message}`));
            } else if (result) {
              this.logger.log(`File uploaded successfully to Cloudinary: ${result.public_id}`);
              resolve({
                public_id: result.public_id,
                url: result.url,
                secure_url: result.secure_url,
                resource_type: result.resource_type,
              });
            } else {
              reject(new Error('Upload completed but no result returned'));
            }
          },
        );

        uploadStream.end(fileBuffer);
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error uploading file to Cloudinary: ${errorMessage}`);
      throw new Error(`Failed to upload file to Cloudinary: ${errorMessage}`);
    }
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
      this.logger.log(`File deleted successfully from Cloudinary: ${publicId}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error deleting file from Cloudinary: ${errorMessage}`);
      throw new Error(`Failed to delete file from Cloudinary: ${errorMessage}`);
    }
  }

  async generateThumbnail(
    publicId: string,
    width: number = 300,
    height: number = 300,
  ): Promise<string> {
    try {
      const thumbnailUrl = cloudinary.url(publicId, {
        width,
        height,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto',
      });
      return thumbnailUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error generating thumbnail: ${errorMessage}`);
      throw new Error(`Failed to generate thumbnail: ${errorMessage}`);
    }
  }

  getUrl(publicId: string, options?: Record<string, any>): string {
    try {
      return cloudinary.url(publicId, options || {});
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error generating URL: ${errorMessage}`);
      throw new Error(`Failed to generate URL: ${errorMessage}`);
    }
  }
}
