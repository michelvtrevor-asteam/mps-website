#!/usr/bin/env node
/**
 * Performance checks: run Next.js build and report success/failure.
 * Use after `npm run build` or run `npm run perf` (runs build internally).
 */
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const child = spawn(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "build"], {
  cwd: root,
  stdio: "inherit",
});

child.on("close", (code) => {
  process.exit(code ?? 0);
});
