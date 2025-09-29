import cors from 'cors';
import express from 'express';
import { config } from 'dotenv';
import bookRoutes from './routes/book.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { sequelize } from './models/index.js';

config();

const app = express();
const PORT = Number(process.env.APP_PORT || 4000);
const SHOULD_SYNC = process.env.SHOULD_SYNC_SCHEMA !== 'false';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Book Management API is running' });
});

app.use('/api/books', bookRoutes);

app.use(errorHandler);

async function startServer() {
  try {
    await sequelize.authenticate();
    if (SHOULD_SYNC) {
      await sequelize.sync();
    }
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
