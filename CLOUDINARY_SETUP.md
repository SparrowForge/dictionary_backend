# Cloudinary File Upload Integration

## Overview
The file upload system has been successfully migrated from AWS S3 to Cloudinary.

## Environment Variables
The following Cloudinary credentials are already configured in your `.env` file:
```
CLOUDINARY_CLOUD_NAME=ds8p3rvyx
CLOUDINARY_API_KEY=993183136324497
CLOUDINARY_API_SECRET=c_cIHaeA5zjiEz0hgDnAaMf9F6A
CLOUDINARY_FOLDER=dictionary
```

## Changes Made

### 1. New Files Created
- **`src/files/cloudinary.service.ts`** - Cloudinary service for handling file uploads, deletions, and URL generation

### 2. Modified Files

#### `src/files/files.service.ts`
- Replaced `S3Service` with `CloudinaryService`
- Updated `uploadFile()` method to use Cloudinary upload
- Simplified thumbnail generation (Cloudinary handles this natively)
- Updated `deleteFile()` method to delete from Cloudinary
- Updated `getFileStream()` and `generateFileUrl()` methods to work with Cloudinary
- Updated `cleanupOrphanedFiles()` method to delete from Cloudinary

#### `src/files/files.module.ts`
- Removed `S3Service` and `AwsConfigService` providers
- Added `CloudinaryService` provider
- Updated exports to include `CloudinaryService`

### 3. Package Installation
- Installed `cloudinary` package via npm

## Features

### File Upload
Files are uploaded to Cloudinary with the following configuration:
- **Folder Structure**: `{entity_type}/{entity_id}`
- **Auto Resource Detection**: Cloudinary automatically detects file type
- **Filename Handling**: Unique filename generation with timestamp

### Image Handling
- **Thumbnail Generation**: Automatically generated on-the-fly (300x300)
- **Quality Optimization**: Auto quality detection for optimal file size
- **Format Support**: JPEG, PNG, GIF, WebP

### File Management
- **Secure URLs**: Uses HTTPS secure URLs for all files
- **File Deletion**: Removes files from Cloudinary when deleted from database
- **URL Generation**: Generates transformation URLs for dynamic resizing

## API Usage

### Upload File
```
POST /api/v1/files/upload
Content-Type: multipart/form-data

file: <binary>
entity_type: "users"
entity_id: 1
file_type: "profile_picture"
file_category: "personal"
```

### Response
```json
{
  "success": true,
  "file_id": 1,
  "file_url": "https://res.cloudinary.com/...",
  "thumbnail_url": "https://res.cloudinary.com/...",
  "original_name": "photo.jpg",
  "file_name": "1234567890_users_1.jpg",
  "file_size": 102400,
  "mime_type": "image/jpeg",
  "file_type": "profile_picture",
  "file_category": "personal",
  "message": "File uploaded successfully to Cloudinary",
  "public_url": "https://res.cloudinary.com/..."
}
```

## Benefits of Cloudinary

1. **Automatic Image Optimization**: Reduces file sizes while maintaining quality
2. **Responsive Images**: Easy URL-based transformations for different screen sizes
3. **CDN Distribution**: Global content delivery network for faster access
4. **No Server Storage**: Reduces server storage and bandwidth costs
5. **Advanced Features**: Built-in image manipulation, AI-powered cropping, etc.

## Migration from S3

The old S3 service files remain in the codebase but are no longer used:
- `src/files/s3.service.ts` (deprecated)
- `src/config/aws-config.service.ts` (still used for other AWS services)

AWS S3 credentials in `.env` are still available if needed for other services.

## Testing

To test the Cloudinary integration:

1. Start the development server:
   ```bash
   npm run start:dev
   ```

2. Use the Swagger UI at `http://localhost:3000/api/docs`

3. Upload a file using the `/api/v1/files/upload` endpoint

4. Verify the file appears in your Cloudinary dashboard at [Cloudinary Console](https://cloudinary.com/console)

## Support

For Cloudinary API documentation, visit: https://cloudinary.com/documentation
