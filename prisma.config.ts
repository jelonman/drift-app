import "dotenv/config";
import { defineConfig } from "prisma/config";

const url = process.env["DATABASE_URL"] || "";
const isSqlite = url.startsWith("file:");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: isSqlite ? "prisma/migrations-sqlite" : "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
