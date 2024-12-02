import express from 'express';
import cors from 'cors';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { PORT } from './config.js';

import userRoutes from './routes/users.routes.js';
import authRoutes from './routes/auth.routes.js';
import materialRoutes from './routes/materials.routes.js';
import productRoutes from './routes/finishedProducts.routes.js';
import productsMaterialsRoutes from './routes/productsMaterials.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname);

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", materialRoutes);
app.use("/api", productRoutes);
app.use("/api", productsMaterialsRoutes);
app.use("/api", inventoryRoutes);

app.use(express.static(join(__dirname, '../frontend/build')));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});