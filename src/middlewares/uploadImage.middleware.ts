import type { RequestHandler } from "express";
import multer from "multer";
import { HttpError } from "../types/errors.js";

const maxBytes = 5 * 1024 * 1024;

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: maxBytes },
  fileFilter(_req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      cb(new HttpError(400, "Le fichier doit être une image (JPEG, PNG, WebP, etc.)."));
      return;
    }
    cb(null, true);
  },
});

const uploadSingleImage = upload.single("image");

/** Champ multipart attendu : `image`. */
export const parseSingleImageUpload: RequestHandler = (req, res, next) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      next(err);
      return;
    }
    next();
  });
};
