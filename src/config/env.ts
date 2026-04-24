import dotenv from "dotenv";

dotenv.config();

/** Une seule ligne `CLOUDINARY_URL` (tableau de bord Cloudinary) remplit les trois clés. */
function applyCloudinaryUrl(): void {
  const raw = process.env.CLOUDINARY_URL?.trim();
  if (!raw) return;
  try {
    const u = new URL(raw);
    if (u.protocol !== "cloudinary:") return;
    const host = u.hostname;
    if (!u.username || !u.password || !host) return;
    process.env.CLOUDINARY_CLOUD_NAME ??= host;
    process.env.CLOUDINARY_API_KEY ??= u.username;
    process.env.CLOUDINARY_API_SECRET ??= u.password;
  } catch {
    /* URL invalide : ignoré */
  }
}

applyCloudinaryUrl();

const nodeEnv = process.env.NODE_ENV ?? "development";
const isDev = nodeEnv === "development";

const jwtSecretFromEnv = process.env.JWT_SECRET?.trim() ?? "";
const jwtSecret =
  jwtSecretFromEnv ||
  (isDev ? "dev-only-insecure-jwt-secret-change-me" : "");

export const env = {
  nodeEnv,
  port: Number(process.env.PORT) || 3000,
  isDev,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN?.trim() || "7d",
  /** Dossier logique Cloudinary (sous le compte), ex. `maquis-app` */
  cloudinaryFolder:
    process.env.CLOUDINARY_UPLOAD_FOLDER?.replace(/^\/+|\/+$/g, "") ||
    "maquis-app",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  smtpHost: process.env.SMTP_HOST?.trim() ?? "",
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpSecure: process.env.SMTP_SECURE?.trim() === "true",
  smtpUser: process.env.SMTP_USER?.trim() ?? "",
  smtpPass: process.env.SMTP_PASS ?? "",
  smtpFrom: process.env.SMTP_FROM?.trim() ?? "",
} as const;

export const isCloudinaryConfigured = Boolean(
  env.cloudinaryCloudName &&
    env.cloudinaryApiKey &&
    env.cloudinaryApiSecret,
);
