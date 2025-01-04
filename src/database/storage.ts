import { S3Client, HeadBucketCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import defaultConfig from "@assets/config/default";
import logger from "@utils/functions/logger";

const storage = {
    createClient: async (check?: boolean) => {
        try {            
            const STORAGE_URL = defaultConfig.mode === "developing" ? process.env.STORAGE_URL_DEV : process.env.STORAGE_URL_PRD;
            const STORAGE_BUCKET = defaultConfig.mode === "developing" ? process.env.STORAGE_BUCKET_NAME_DEV : process.env.STORAGE_BUCKET_NAME_PRD;

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
};

export default storage;
