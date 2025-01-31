import { 
    S3Client, 
    HeadBucketCommand, 
    PutObjectCommand, 
    GetObjectCommand, 
    ListObjectsV2Command, 
    DeleteObjectCommand, 
    HeadObjectCommand 
} from "@aws-sdk/client-s3";

import defaultConfig from "@assets/config/default";
import logger from "@utils/functions/logger";

const storage = {
    createClient: async (check?: boolean) => {
        try {            
            const STORAGE_BUCKET = process.env.STORAGE_BUCKET_NAME;
            const STORAGE_URL = process.env.STORAGE_URL;

            if (!STORAGE_URL || !STORAGE_BUCKET) {
                logger.error("[createClient] Storage URI or Bucket Name is missing.");
                process.exit(1);
            }

            const s3Client = new S3Client({
                endpoint: STORAGE_URL,
                region: "br-se1",
                credentials: {
                    accessKeyId: process.env.STORAGE_ID || "",
                    secretAccessKey: process.env.STORAGE_SECRET || "",
                },
            });

            if (check) {
                logger.info(`Storage connected: ${STORAGE_BUCKET}`);
            }

            return { s3Client, bucket: STORAGE_BUCKET };
        } catch (error) {
            logger.error("[createClient] Bucket connection error.");
            console.error(error);
            process.exit(1);
        }
    },
    checkStorageConnect: async () => {
        try {
            const { s3Client, bucket } = await storage.createClient(true);
            const command = new HeadBucketCommand({ Bucket: bucket });
            await s3Client.send(command);
        } catch (error) {
            logger.error("[checkStorageConnect] Internal error.");
            console.error(error);
            process.exit(1);
        }
    },
    uploadFile: async (fileName: string, fileContent: Buffer | Uint8Array | Blob | string, mimeType: string, folderPath: string = '') => {
        try {
            const { s3Client, bucket } = await storage.createClient();

            const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

            const command = new PutObjectCommand({
                Bucket: bucket,
                Key: filePath,
                Body: fileContent,
                ContentType: mimeType,
            });

            const response = await s3Client.send(command);
            return response;
        } catch (error) {
            throw error;
        }
    },
    getFile: async (filePath: string) => {
        try {
            const { s3Client, bucket } = await storage.createClient();

            const command = new GetObjectCommand({
                Bucket: bucket,
                Key: filePath,
            });

            const response = await s3Client.send(command);
            return response;
        } catch (error) {
            throw error;
        }
    },
    listFiles: async (folderPath: string) => {
        try {
            const { s3Client, bucket } = await storage.createClient();

            const command = new ListObjectsV2Command({
                Bucket: bucket,
                Prefix: folderPath,
            });

            const response = await s3Client.send(command);
            const fileList = response.Contents?.map((item) => item.Key) || [];
            return fileList;
        } catch (error) {
            throw error;
        }
    },
    deleteFile: async (filePath: string) => {
        try {
            const { s3Client, bucket } = await storage.createClient();

            const command = new DeleteObjectCommand({
                Bucket: bucket,
                Key: filePath,
            });

            const response = await s3Client.send(command);
            return response;
        } catch (error) {
            throw error
        }
    },
    getFileInfo: async (filePath: string) => {
        try {
            const { s3Client, bucket } = await storage.createClient();

            const command = new HeadObjectCommand({
                Bucket: bucket,
                Key: filePath,
            });

            const response = await s3Client.send(command);
            return {
                contentLength: response.ContentLength,
                lastModified: response.LastModified,
                contentType: response.ContentType,
                metadata: response.Metadata,
                etag: response.ETag,
            };
        } catch (error) {
            throw error;
        }
    },
};

export default storage;
