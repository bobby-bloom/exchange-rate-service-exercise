import express, { Request, Response, Router } from 'express';
import { ConvertInput, InputValidator, RateInput } from './input-validator';
import { ExchangeRateController } from './exchange-rate-controller';

export function createRouter(
  exchangeRateController: ExchangeRateController,
): Router {
  const router: Router = express.Router();
  const inputValidator = new InputValidator();

  router.get('/rates/:isoCode', (req: Request, res: Response): void => {
    try {
      const isoCode: string = inputValidator.validateIsoCode(
        req.params.isoCode,
      );

      const result = exchangeRateController.getRates(isoCode);

      res.json(result);
    } catch (error) {
      res.status(400).send(getErrorMessage(error));
    }
  });

  router.post('/rates/:isoCode', (req: Request, res: Response): void => {
    try {
      const isoCode: string = inputValidator.validateIsoCode(
        req.params.isoCode,
      );
      const rateInput: RateInput = inputValidator.validateRateInput(req.body);

      exchangeRateController.addRate(isoCode, rateInput);

      res.json(rateInput);
    } catch (error) {
      res.status(400).send(getErrorMessage(error));
    }
  });

  router.get('/convert', (req: Request, res: Response): void => {
    try {
      const convertInput: ConvertInput = inputValidator.validateConvertParams(
        req.query,
      );

      const result = exchangeRateController.convert(convertInput);

      res.json({ ...convertInput, result: result });
    } catch (error) {
      res.status(400).send(getErrorMessage(error));
    }
  });

  return router;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}
