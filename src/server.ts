import { createApp } from "./app.js";
import { env } from "./config/env.js";

if (!env.isDev && !env.jwtSecret) {
  console.error("JWT_SECRET est obligatoire lorsque NODE_ENV n’est pas « development ».");
  process.exit(1);
}
import {
  connectDatabase,
  disconnectDatabase,
  verifyDatabase,
} from "./config/database.js";

async function main(): Promise<void> {
  await connectDatabase();
  await verifyDatabase();
  console.log("Base de données : OK (connexion + requête de test)");

  const app = createApp();

  app.listen(env.port, () => {
    console.log(
      `Serveur HTTP : OK — http://localhost:${env.port} (${env.nodeEnv})`,
    );
  });

  const shutdown = async (signal: string) => {
    console.log(`${signal} reçu, arrêt…`);
    await disconnectDatabase();
    process.exit(0);
  };

  process.once("SIGINT", () => void shutdown("SIGINT"));
  process.once("SIGTERM", () => void shutdown("SIGTERM"));
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
