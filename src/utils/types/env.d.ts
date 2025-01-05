declare namespace NodeJS {
    interface ProcessEnv {
      STORAGE_BUCKET_NAME: string;
      PRIVATE_ACCESS_TOKEN: string;
      PUBLIC_ACCESS_TOKEN: string;
      STORAGE_SECRET: string;
      STORAGE_URL:  string;
      PRODUCTION: string;
      STORAGE_ID: string;
      MONGO_URI: string;
      SECRET: string;
      PORT: number;
    }
  }