import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../password";

describe("password", () => {
  it("hashes a password", async () => {
    const hash = await hashPassword("test123");
    expect(hash).toBeDefined();
    expect(typeof hash).toBe("string");
    expect(hash.length).toBeGreaterThan(20);
    expect(hash).not.toBe("test123");
  });

  it("verifies correct password", async () => {
    const hash = await hashPassword("secret");
    const ok = await verifyPassword("secret", hash);
    expect(ok).toBe(true);
  });

  it("rejects wrong password", async () => {
    const hash = await hashPassword("secret");
    const ok = await verifyPassword("wrong", hash);
    expect(ok).toBe(false);
  });
});
