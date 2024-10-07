declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    PORT?: string;
    DATABASE_URL: string;
    AUTH_KEY: string;
  }
}
