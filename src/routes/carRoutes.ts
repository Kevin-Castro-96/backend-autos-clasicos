import { Router } from "express";
import {
  addCar,
  editCar,
  getCars,
  getCarById,
  deleteCar,
} from "../controllers/carController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

/**
 * @openapi
 * /api/cars:
 *   get:
 *     summary: Obtener todos los autos
 *     tags: [Cars]
 *     responses:
 *       200:
 *         description: Listado de autos
 */
router.get("/", getCars);

/**
 * @openapi
 * /api/cars/{id}:
 *   get:
 *     summary: Obtener un auto por su ID
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del auto a obtener
 *     responses:
 *       200:
 *         description: Auto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Auto obtenido por ID
 *                 data:
 *                   $ref: '#/components/schemas/Car'
 *       404:
 *         description: Auto no encontrado
 */
router.get("/:id", getCarById);

/**
 * @openapi
 * /api/cars:
 *   post:
 *     summary: Agregar un nuevo auto (usuario autenticado)
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [brand, model, year, engine]
 *             properties:
 *               brand:
 *                 type: string
 *                 example: Ford
 *               model:
 *                 type: string
 *                 example: Mustang
 *               year:
 *                 type: integer
 *                 example: 1967
 *               engine:
 *                 type: string
 *                 example: V8 4.7L
 *               image:
 *                 type: string
 *                 example: https://example.com/mustang-1967.jpg
 *     responses:
 *       201:
 *         description: Auto creado correctamente
 */
router.post("/", authMiddleware, addCar);

/**
 * @openapi
 * /api/cars/{id}:
 *   put:
 *     summary: Actualizar un auto existente
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del auto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: integer
 *               engine:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Auto actualizado
 *       403:
 *         description: No autorizado
 */
router.put("/:id", authMiddleware, editCar);
/**
 * @openapi
 * /api/cars/{id}:
 *   delete:
 *     summary: Eliminar un auto existente
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del auto a eliminar
 *     responses:
 *       200:
 *         description: Auto eliminado correctamente
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Auto no encontrado
 */
router.delete("/:id", authMiddleware, deleteCar);


export default router;
