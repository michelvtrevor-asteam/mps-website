import { prisma } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth/password";
import { UserRole } from "@prisma/client";

async function main() {
  const programs = [
    { name: "Daycare", slug: "daycare" },
    { name: "Play Group", slug: "play-group" },
    { name: "Nursery", slug: "nursery" },
    { name: "LKG", slug: "lkg" },
    { name: "UKG", slug: "ukg" },
  ];

  for (const p of programs) {
    await prisma.program.upsert({
      where: { slug: p.slug },
      update: { name: p.name },
      create: p,
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@maanvispreschool.local";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@12345";
  const parentEmail = process.env.DEMO_PARENT_EMAIL ?? "parent@demo.local";
  const parentPassword = process.env.DEMO_PARENT_PASSWORD ?? "Parent@12345";

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: await hashPassword(adminPassword),
        role: UserRole.ADMIN,
      },
    });
  }

  // Demo parent user (for testing parent dashboard)
  const nursery = await prisma.program.findUnique({ where: { slug: "nursery" } });
  if (nursery) {
    let demoParentUser = await prisma.user.findUnique({ where: { email: parentEmail } });
    if (!demoParentUser) {
      demoParentUser = await prisma.user.create({
        data: {
          email: parentEmail,
          passwordHash: await hashPassword(parentPassword),
          role: UserRole.PARENT,
        },
      });
      const parentProfile = await prisma.parentProfile.create({
        data: {
          userId: demoParentUser.id,
          name: "Demo Parent",
          phone: "+919876543210",
        },
      });
      await prisma.student.create({
        data: {
          fullName: "Demo Student",
          dateOfBirth: new Date("2022-06-01"),
          age: 3,
          address: "123 Demo Lane",
          programId: nursery.id,
          parentProfileId: parentProfile.id,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

