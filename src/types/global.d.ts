declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_URL: string;
      DB_BASE: string;
      DB_PORT: number;
      DB_HOST: string;
      DB_MONGO: string;
      ADMIN_PASSWORD: string;
      CONTROL_TOKEN_SECRET: string;
      TOKEN_SECRET: string;
      ADMIN_TOKEN_SECRET: string;
      TIME_TOKENS: number;
    }
  }
}
export {};
