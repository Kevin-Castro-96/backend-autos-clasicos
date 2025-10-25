import { AppDataSource } from "../config/data-source";
import { Car } from "../entities/Car";
import { User } from "../entities/User";

export async function createCar(user: User, payload: Partial<Car>) {
  const repo = AppDataSource.getRepository(Car);
  const car = repo.create({ ...payload, owner: user });
  return repo.save(car);
}

export async function updateCar(carId: string, userId: string, updates: Partial<Car>) {
  const repo = AppDataSource.getRepository(Car);
  const car = await repo.findOne({ where: { id: carId }, relations: ["owner"] });
  if (!car) throw new Error("Car not found");
  if (car.owner.id !== userId) throw new Error("Not authorized");
  Object.assign(car, updates);
  return repo.save(car);
}

export async function listCars() {
  return AppDataSource.getRepository(Car).find({ relations: ["owner"] });
}

export async function carByIdService(id: string) {
  const repo = AppDataSource.getRepository(Car);
  const car = await repo.findOne({
    where: { id },
    relations: ["owner"],
  });
  if (!car) throw new Error("Car not found");
  return car;
}

