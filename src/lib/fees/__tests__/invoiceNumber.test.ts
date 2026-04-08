import { describe, it, expect } from "vitest";
import { generateInvoiceNumber } from "../invoiceNumber";

describe("generateInvoiceNumber", () => {
  it("returns format INV-YYYYMMDD-XXXX", () => {
    const d = new Date("2025-03-06T12:00:00Z");
    const num = generateInvoiceNumber(d);
    expect(num).toMatch(/^INV-20250306-\d{4}$/);
    expect(num).toBe("INV-20250306-" + num.slice(-4));
  });

  it("uses provided date", () => {
    const d = new Date("2024-01-01");
    const num = generateInvoiceNumber(d);
    expect(num.startsWith("INV-20240101-")).toBe(true);
  });

  it("suffix is 4 digits", () => {
    const num = generateInvoiceNumber(new Date());
    const suffix = num.split("-").at(-1);
    expect(suffix?.length).toBe(4);
    expect(Number(suffix)).toBeGreaterThanOrEqual(1000);
    expect(Number(suffix)).toBeLessThanOrEqual(9999);
  });
});
