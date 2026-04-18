import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_USER_EMAIL ?? "admin@example.com";
  const name = process.env.SEED_USER_NAME ?? "Premier utilisateur";

  const user = await prisma.user.upsert({
    where: { email },
    update: { name },
    create: { email, name },
  });

  console.log("Utilisateur seed :", { id: user.id, email: user.email, name: user.name });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
