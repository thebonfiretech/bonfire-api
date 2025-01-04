import defaultConfig from "@assets/config/default";
import logger from "@utils/functions/logger";

const storage = {
    checkStorageConnect: async () => {
        try {            
            const STORAGE_URL = defaultConfig.mode == "developing" ? process.env.STORAGE_URL_DEV : process.env.STORAGE_URL_PRD;
            if (!STORAGE_URL) {
                logger.error("[checkStorageConnect] No storage URI");
                process.exit(1);
            };
            const STORAGE_BUCKET = defaultConfig.mode == "developing" ? process.env.STORAGE_BUCKET_NAME_DEV : process.env.STORAGE_BUCKET_NAME_PRD;
            if (!STORAGE_BUCKET) {
                logger.error("[checkStorageConnect] No storage bucket name");
                process.exit(1);
            };


            logger.info("Storage connected: " + STORAGE_BUCKET);
            
            return { STORAGE_BUCKET };

        } catch (error) {
            logger.error("[checkStorageConnect] Database connect error");
            console.log(error);
            process.exit(1);
        }
    }
};

export default storage;