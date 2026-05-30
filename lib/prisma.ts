import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

function createPrismaClient() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Serverless: cap connections per function instance.
    // Default is 10; with concurrent Vercel invocations that exhausts
    // Supabase's connection limit and causes empty HTTP responses.
    max: 2,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 8_000,
    ssl: { rejectUnauthorized: false }, // required for Supabase from Vercel IPs
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
