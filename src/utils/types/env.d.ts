declare namespace NodeJS {
    interface ProcessEnv {
      PRIVATE_ACCESS_TOKEN: string;
      PUBLIC_ACCESS_TOKEN: string;
      MONGO_URI_PRD?: string;
      MONGO_URI_DEV: string;
      PRODUCTION: string;
      SECRET: string;
      PORT: number;
    }
  }