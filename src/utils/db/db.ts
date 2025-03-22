import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// Initialize the Neon client and Drizzle ORM
const sql = neon(
  process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npg_NF6v9TVESAxg@ep-red-paper-a5w7d5oj-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
);
export const db = drizzle(sql);
