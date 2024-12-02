import express from 'express';
import cors from 'cors';

import userRoutes from './routes/users.routes.js';
import authRoutes from './routes/auth.routes.js';
import materialRoutes from './routes/materials.routes.js';
import productRoutes from './routes/finishedProducts.routes.js';
import productsMaterialsRoutes from './routes/productsMaterials.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';

import { PORT } from './config.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", materialRoutes);
app.use("/api", productRoutes);
app.use("/api", productsMaterialsRoutes);
app.use("/api", inventoryRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});