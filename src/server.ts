import { createApp } from "./app.js";
import { env } from "./config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "./config/database.js";

async function main(): Promise<void> {
  await connectDatabase();
  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Serveur sur http://localhost:${env.port} (${env.nodeEnv})`);
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
