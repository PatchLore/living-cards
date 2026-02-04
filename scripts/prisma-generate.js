/**
 * Runs prisma generate with a build-time fallback for DATABASE_URL.
 * Prisma schema requires env("DATABASE_URL") - generate does not connect to the DB,
 * so we use a dummy URL when DATABASE_URL is unset (e.g. CI, Vercel before env is set).
 */
const { execSync } = require("child_process");

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgresql://build:build@localhost:5432/build?schema=public";
  console.warn(
    "[prisma-generate] DATABASE_URL not set; using dummy URL for generate only (no connection is made)."
  );
}

execSync("npx prisma generate", {
  stdio: "inherit",
  env: process.env,
});
