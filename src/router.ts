import express, { Request, Response, Router } from 'express';
import { ConvertInput, InputValidator, RateInput } from './input-validator';

export function createRouter(): Router {
  const router: Router = express.Router();
  const inputValidator = new InputValidator();

  router.get('/rates/:isoCode', (req: Request, res: Response): void => {
    try {
      const isoCode: string = inputValidator.validateIsoCode(
        req.params.isoCode,
      );

      //TODO replace with your code
      console.log(`GET /rates/${isoCode}`);
      res.json([]); // return result
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

      //TODO replace with your code
      console.log(`POST /rates/${isoCode}`, rateInput);
      res.json(rateInput); // return result
    } catch (error) {
      res.status(400).send(getErrorMessage(error));
    }
  });

  router.get('/convert', (req: Request, res: Response): void => {
    try {
      const convertInput: ConvertInput = inputValidator.validateConvertParams(
        req.query,
      );

      //TODO replace with your code
      console.log('GET /convert', convertInput);
      res.json({}); // return result
    } catch (error) {
      res.status(400).send(getErrorMessage(error));
    }
  });

  return router;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}
