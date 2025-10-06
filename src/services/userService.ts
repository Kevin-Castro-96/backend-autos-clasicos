import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function createUser(name: string, email: string, password: string) {
  const repo = AppDataSource.getRepository(User);
  const exists = await repo.findOneBy({ email });
  if (exists) throw new Error("Email already registered");
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = repo.create({ name, email, password: hashed });
  return repo.save(user);
}

export async function findByEmail(email: string) {
  return AppDataSource.getRepository(User).findOneBy({ email });
}

export async function findById(id: string) {
  return AppDataSource.getRepository(User).findOne({ where: { id } , relations: ["cars"]});
}
