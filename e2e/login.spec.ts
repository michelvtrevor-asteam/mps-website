import { test, expect } from "@playwright/test";

test.describe("Login", () => {
  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /maanvi.*preschool/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test("demo credentials section can be expanded", async ({ page }) => {
    await page.goto("/login");
    await page.getByText("Demo credentials").click();
    await expect(page.getByText("admin@maanvispreschool.local")).toBeVisible();
    await expect(page.getByText("parent@demo.local")).toBeVisible();
  });

  test("admin login redirects and can access admin", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("admin@maanvispreschool.local");
    await page.getByLabel(/password/i).fill("Admin@12345");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).not.toHaveURL(/\/login/, { timeout: 10000 });
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.getByRole("heading", { name: /admin dashboard/i })).toBeVisible();
  });

  test("parent login redirects and can access parent dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("parent@demo.local");
    await page.getByLabel(/password/i).fill("Parent@12345");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).not.toHaveURL(/\/login/, { timeout: 10000 });
    await page.goto("/parent");
    await expect(page).toHaveURL(/\/parent/);
    await expect(page.getByText(/overview|profile|attendance|fees/i).first()).toBeVisible({ timeout: 5000 });
  });

  test("invalid credentials show error", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("wrong@example.com");
    await page.getByLabel(/password/i).fill("wrong");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/invalid email or password/i)).toBeVisible({ timeout: 5000 });
  });
});
