import express, { Application } from 'express';
import { createRouter } from './router';

const PORT = 3000;

const app: Application = express();

app.use(express.json({ limit: '200kb' }));
app.use('/', createRouter());

app.listen(PORT, (): void => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
