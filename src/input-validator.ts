import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
addFormats(ajv);
const coerceAjv = new Ajv({ coerceTypes: true });
addFormats(coerceAjv);

export type RateInput = {
  startDate: string;
  endDate: string;
  exchangeRate: number;
};

export type ConvertInput = {
  from: string;
  to: string;
  date: string;
  amount: number;
};

const ISO_CODE_SCHEMA: JSONSchemaType<string> = {
  type: 'string',
  minLength: 3,
  maxLength: 3,
};

const RATE_INPUT_SCHEMA: JSONSchemaType<RateInput> = {
  type: 'object',
  properties: {
    startDate: { type: 'string', format: 'date' },
    endDate: { type: 'string', format: 'date' },
    exchangeRate: { type: 'number', exclusiveMinimum: 0 },
  },
  required: ['startDate', 'endDate', 'exchangeRate'],
};

const CONVERT_INPUT_SCHEMA: JSONSchemaType<ConvertInput> = {
  type: 'object',
  properties: {
    from: ISO_CODE_SCHEMA,
    to: ISO_CODE_SCHEMA,
    date: { type: 'string', format: 'date' },
    amount: { type: 'number' },
  },
  required: ['from', 'to', 'date', 'amount'],
};

export class InputValidator {
  private readonly isoCodeValidator = ajv.compile(ISO_CODE_SCHEMA);
  private readonly rateInputValidator = ajv.compile(RATE_INPUT_SCHEMA);
  private readonly convertInputValidator =
    coerceAjv.compile(CONVERT_INPUT_SCHEMA);

  public validateIsoCode(data: unknown): string {
    if (this.isoCodeValidator(data)) {
      return data;
    } else {
      throw new Error(
        ajv.errorsText(this.isoCodeValidator.errors, { dataVar: 'ISO-code' }),
      );
    }
  }

  public validateRateInput(data: unknown): RateInput {
    if (this.rateInputValidator(data)) {
      return data;
    } else {
      throw new Error(ajv.errorsText(this.rateInputValidator.errors));
    }
  }

  public validateConvertParams(data: unknown): ConvertInput {
    if (this.convertInputValidator(data)) {
      return data;
    } else {
      throw new Error(
        coerceAjv.errorsText(this.convertInputValidator.errors, {
          dataVar: 'parameter',
        }),
      );
    }
  }
}
