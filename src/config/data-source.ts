import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Car } from "../entities/Car";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL no está definida");
}

export const AppDataSource = new DataSource({
  type: "postgres",
  url: DATABASE_URL,
  entities: [User, Car],
  synchronize: true, // Para desarrollo usar true; en producción mejor usar migraciones y false
  logging: false,
});

export async function initDataSource() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log("Conectado a Supabase/PostgreSQL ✅");
  }
  return AppDataSource;
}
