import mongoose from "mongoose";

import defaultConfig from "@assets/config/default";
import logger from "@utils/functions/logger";

const database = {
    connectMongoose: async () => {
        try {            
            mongoose.set("strictQuery", true);
            
            const MONGO_URI = defaultConfig.mode == "developing" ? process.env.MONGO_URI_DEV : process.env.MONGO_URI_PRD;
            if (!MONGO_URI) {
                logger.error("[connectMongoose] No database URI");
                process.exit(1);
            };

            await mongoose.connect(MONGO_URI);

            logger.info("Database connected");
        } catch (error) {
            logger.error("[connectMongoose] Database connect error");
            console.log(error);
            process.exit(1);
        }
    }
};

export default database;