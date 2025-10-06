import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import carRoutes from "./routes/carRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiAssetPath from "swagger-ui-dist";
import { initDataSource } from "./config/data-source";

const app = express();
app.use(cors());
app.use(express.json());

// Ruta raíz
app.get("/", (req, res) => {
  res.json({
    message: "Servidor funcionando ✅. Para documentación visita /docs",
  });
});

// Swagger setup con opciones para mostrar ejemplos
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Classic Cars API",
      version: "1.0.0",
      description:
        "API para autos clásicos (60s, 70s, 80s) con autenticación y gestión de autos.",
    },
    servers: [
      {
        url: "https://back-autos-clasicos.vercel.app",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.ss", "./src/controllers/*.js"],
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  swaggerOptions: {},
  customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.6.0/swagger-ui.css",
  customJs: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.29.1/swagger-ui.js"
}));
// routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);

const PORT = process.env.PORT || 3000;
initDataSource()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Local server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("DB init error", err);
  });
