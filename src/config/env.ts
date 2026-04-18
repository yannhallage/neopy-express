import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT) || 3000,
  isDev: (process.env.NODE_ENV ?? "development") === "development",
  /** Dossier logique Cloudinary (sous le compte), ex. `maquis-app` */
  cloudinaryFolder:
    process.env.CLOUDINARY_UPLOAD_FOLDER?.replace(/^\/+|\/+$/g, "") ||
    "maquis-app",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
} as const;

export const isCloudinaryConfigured = Boolean(
  env.cloudinaryCloudName &&
    env.cloudinaryApiKey &&
    env.cloudinaryApiSecret,
);
