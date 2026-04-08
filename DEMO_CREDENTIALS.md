# Demo credentials (Maanvi's Preschool)

Use these after running `npx prisma db seed` (or `npm run prisma:seed` if you add the script).

| Role   | Email                          | Password   |
|--------|---------------------------------|------------|
| Admin  | admin@maanvispreschool.local    | Admin@12345 |
| Parent | parent@demo.local               | Parent@12345 |

- **Admin**: full access to `/admin` (admissions, students, fees, results, gallery, reports, notifications).
- **Parent**: access to `/parent` (overview, profile, attendance, fees, results, notifications) for the demo student.

To reseed (recreates programs and demo users if missing):

```bash
cd mps
npx prisma db seed
```

To change demo passwords, set env before seeding: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `DEMO_PARENT_EMAIL`, `DEMO_PARENT_PASSWORD`.
