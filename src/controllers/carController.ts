import { Request, Response } from "express";
import { initDataSource } from "../config/data-source";
import {
  createCar,
  updateCar,
  listCars,
  carByIdService,
  deleteCarService,
} from "../services/carService";
import { success, fail } from "../utils/responseHelper";

export async function addCar(req: Request, res: Response) {
  try {
    await initDataSource();
    const user = (req as any).user; // seteado por middleware
    const { brand, model, year, engine, image } = req.body;
    if (!brand || !model || !year || !engine) {
      return res.status(400).json(fail(400, "Datos incompletos"));
    }
    const car = await createCar(user, {
      brand,
      model,
      year: +year,
      engine,
      image,
    });
    return res.status(201).json(success(201, "Auto creado", car));
  } catch (err: any) {
    return res.status(400).json(fail(400, err.message || "Error creando auto"));
  }
}

export async function editCar(req: Request, res: Response) {
  try {
    await initDataSource();
    const user = (req as any).user;
    const { id } = req.params;
    const updates = req.body;
    const updated = await updateCar(id, user.id, updates);
    return res.json(success(200, "Auto actualizado", updated));
  } catch (err: any) {
    const status = err.message === "Not authorized" ? 403 : 400;
    return res.status(status).json(fail(status, err.message));
  }
}

export async function getCars(req: Request, res: Response) {
  try {
    await initDataSource();
    const cars = await listCars();
    return res.json(success(200, "Listado de autos", cars));
  } catch (err: any) {
    return res.status(500).json(fail(500, "Error listando autos"));
  }
}

// obtener auto por id
export async function getCarById(req: Request, res: Response) {
  try {
    await initDataSource();
    const { id } = req.params;
    const car = await carByIdService(id);
    return res.json(success(200, "Auto obtenido por ID", car));
  } catch (err: any) {
    const status = err.message === "Car not found" ? 404 : 500;
    return res
      .status(status)
      .json(fail(status, err.message || "Error obteniendo auto por ID"));
  }
}

export async function deleteCar(req: Request, res: Response) {
  try {
    await initDataSource();
    const user = (req as any).user;
    const { id } = req.params;

    const result = await deleteCarService(id, user.id);
    return res.json(success(200, "Auto eliminado correctamente", result));
  } catch (err: any) {
    const status =
      err.message === "Car not found"
        ? 404
        : err.message === "Not authorized"
        ? 403
        : 500;
    return res
      .status(status)
      .json(fail(status, err.message || "Error eliminando auto"));
  }
}
