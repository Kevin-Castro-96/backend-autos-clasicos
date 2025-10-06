import { Request, Response } from "express";
import { initDataSource } from "../config/data-source";
import { createUser, findByEmail } from "../services/userService";
import bcrypt from "bcrypt";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { success, fail } from "../utils/responseHelper";

// ✅ Tipado explícito y seguro
const JWT_SECRET: Secret = process.env.JWT_SECRET || "changeme";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";
const SIGN_OPTIONS: SignOptions = { expiresIn: JWT_EXPIRES as any };

export async function register(req: Request, res: Response) {
  try {
    await initDataSource();

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json(fail(400, "Datos incompletos"));
    }

    const user = await createUser(name, email, password);

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, SIGN_OPTIONS);

    return res.status(201).json(
      success(201, "Usuario creado", {
        user: { id: user.id, name: user.name, email: user.email },
        token,
      })
    );
  } catch (err: any) {
    const msg = err.message || "Error al registrar";
    return res.status(400).json(fail(400, msg));
  }
}

export async function login(req: Request, res: Response) {
  try {
    await initDataSource();

    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json(fail(400, "Faltan credenciales"));

    const user = await findByEmail(email);
    if (!user)
      return res.status(401).json(fail(401, "Credenciales inválidas"));

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json(fail(401, "Credenciales inválidas"));

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, SIGN_OPTIONS);

    return res.json(
      success(200, "Login exitoso", {
        user: { id: user.id, name: user.name, email: user.email },
        token,
      })
    );
  } catch (err: any) {
    return res.status(500).json(fail(500, "Error interno", err.message));
  }
}
