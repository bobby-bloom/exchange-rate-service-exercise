import express, { Application } from 'express';
import { createRouter } from './router';
import { ExchangeRateController } from './exchange-rate-controller';

const PORT = 3000;

const app: Application = express();

const exchangeRateController = new ExchangeRateController();

app.use(express.json({ limit: '200kb' }));
app.use('/', createRouter(exchangeRateController));

app.listen(PORT, (): void => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
