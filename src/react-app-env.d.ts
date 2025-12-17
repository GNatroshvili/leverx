declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    API_URL: string;
  }
}
