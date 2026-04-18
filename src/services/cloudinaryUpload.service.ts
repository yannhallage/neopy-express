import { cloudinary, isCloudinaryConfigured } from "../config/cloudinary.js";
import { env } from "../config/env.js";
import { HttpError } from "../types/errors.js";

export function requireCloudinary(): void {
  if (!isCloudinaryConfigured) {
    throw new HttpError(
      503,
      "Stockage d’images non configuré : définissez CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET.",
    );
  }
}

/**
 * Envoie un buffer image vers Cloudinary et retourne l’URL HTTPS sécurisée.
 */
export async function uploadImageBuffer(
  buffer: Buffer,
  mimeType: string,
  subFolder: "maquis" | "plats",
): Promise<string> {
  requireCloudinary();
  const folder = `${env.cloudinaryFolder}/${subFolder}`;
  const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: "image",
    });
    if (!result.secure_url) {
      throw new HttpError(502, "Réponse Cloudinary invalide (URL manquante).");
    }
    return result.secure_url;
  } catch (e) {
    if (e instanceof HttpError) throw e;
    const msg = e instanceof Error ? e.message : String(e);
    throw new HttpError(502, `Échec envoi Cloudinary : ${msg}`);
  }
}
