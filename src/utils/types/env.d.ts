declare namespace NodeJS {
    interface ProcessEnv {
      STORAGE_BUCKET_NAME_DEV: string;
      STORAGE_BUCKET_NAME_PRD: string;
      PRIVATE_ACCESS_TOKEN: string;
      PUBLIC_ACCESS_TOKEN: string;
      STORAGE_URL_DEV:  string;
      STORAGE_URL_PRD:  string;
      STORAGE_SECRET: string;
      MONGO_URI_PRD?: string;
      MONGO_URI_DEV: string;
      PRODUCTION: string;
      STORAGE_ID: string;
      SECRET: string;
      PORT: number;
    }
  }