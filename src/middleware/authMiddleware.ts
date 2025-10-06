import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { initDataSource } from "../config/data-source";
import { findById } from "../services/userService";
import { fail } from "../utils/responseHelper";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    await initDataSource();
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json(fail(401, "Token faltante"));
    const token = auth.split(" ")[1];
    const payload: any = jwt.verify(token, JWT_SECRET);
    const user = await findById(payload.userId);
    if (!user) return res.status(401).json(fail(401, "Usuario no encontrado"));
    (req as any).user = user;
    next();
  } catch (err: any) {
    return res.status(401).json(fail(401, "Token inválido"));
  }
}
