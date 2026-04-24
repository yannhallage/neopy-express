import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { HttpError } from "../types/errors.js";

const CONFIRMATION_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CONFIRMATION_CODE_LENGTH = 8;

function htmlEscape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function generateConfirmationCode(length = CONFIRMATION_CODE_LENGTH): string {
  let code = "";
  for (let i = 0; i < length; i += 1) {
    const index = Math.floor(Math.random() * CONFIRMATION_CODE_CHARS.length);
    code += CONFIRMATION_CODE_CHARS[index];
  }
  return code;
}

function buildSignupEmailHtml(params: {
  prenom?: string | null;
  nom: string;
  code: string;
}): string {
  const firstName = params.prenom?.trim() || params.nom.trim() || "Client";
  const safeFirstName = htmlEscape(firstName);
  const safeCode = htmlEscape(params.code);

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Confirmation de compte</title>
  </head>
  <body style="margin:0;padding:0;background-color:#fff6ef;font-family:Arial,Helvetica,sans-serif;color:#2e1d15;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#fff6ef;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background-color:#ffffff;border:1px solid #f2dfd3;border-radius:12px;">
            <tr>
              <td style="padding:22px 24px 10px;">
                <p style="margin:0;font-size:22px;font-weight:700;color:#f06423;">GarbaCI</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 24px 24px;">
                <h1 style="margin:0 0 14px;font-size:22px;line-height:1.35;color:#2e1d15;">Confirme ton compte</h1>
                <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#4a362d;">Salut ${safeFirstName},</p>
                <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#4a362d;">
                  Merci pour ton inscription. Saisis ce code pour valider ton adresse email.
                </p>
                <div style="background-color:#fff3e9;border:1px solid #ffd9c4;border-radius:10px;padding:16px;text-align:center;">
                  <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#9a664c;">
                    Code de confirmation
                  </p>
                  <p style="margin:0;font-size:30px;font-weight:700;letter-spacing:0.16em;color:#f06423;">${safeCode}</p>
                </div>
                <p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:#7a5a4c;">
                  Le code expire dans 15 minutes.
                </p>
                <p style="margin:8px 0 0;font-size:13px;line-height:1.6;color:#7a5a4c;">
                  Si tu n'es pas a l'origine de cette demande, ignore cet email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 24px;background-color:#fffaf6;border-top:1px solid #f2dfd3;">
                <p style="margin:0;font-size:12px;line-height:1.5;color:#8d6b5a;">
                  GarbaCI - Livraison et commandes en quelques clics.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

const isSmtpConfigured = Boolean(
  env.smtpHost && env.smtpUser && env.smtpPass && env.smtpFrom,
);

const transporter = isSmtpConfigured
  ? nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
      },
    })
  : null;

export const mailService = {
  generateConfirmationCode,

  async sendSignupConfirmationEmail(params: {
    to: string;
    nom: string;
    prenom?: string | null;
    code: string;
  }): Promise<void> {
    if (!transporter) {
      if (env.isDev) {
        console.warn(
          "[mail] SMTP non configuré. Code de confirmation (dev):",
          params.code,
        );
        return;
      }
      throw new HttpError(
        500,
        "Service email indisponible. Contactez le support.",
      );
    }

    await transporter.sendMail({
      from: env.smtpFrom,
      to: params.to,
      subject: "Confirme la creation de ton compte GarbaCI",
      text: `Bienvenue sur GarbaCI.\n\nTon code de confirmation est: ${params.code}\n\nSi tu n'es pas a l'origine de cette demande, ignore cet email.`,
      html: buildSignupEmailHtml({
        nom: params.nom,
        prenom: params.prenom,
        code: params.code,
      }),
    });
  },
};
