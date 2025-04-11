import fs from 'node:fs';
import { ExchangeRate } from './exchange-rate';
import { ConvertInput, RateInput } from './input-validator';

export class ExchangeRateController {
  private exchangeRateData: ExchangeRate[];

  constructor(filePath: string = 'files/exchangeRates.json') {
    this.exchangeRateData = [];
    this.loadRatesFromFile(filePath);
  }

  public getRates(isoCode: string) {
    return this.exchangeRateData.filter(
      (value: ExchangeRate) => value.isoCode == isoCode,
    );
  }

  public addRate(isoCode: string, rateInput: RateInput) {
    const newRate = new ExchangeRate(
      isoCode,
      rateInput.exchangeRate,
      new Date(rateInput.startDate),
      new Date(rateInput.endDate),
    );

    this.exchangeRateData = this.exchangeRateData.filter(
      (rate) => !rate.isSubrangeOf(newRate),
    );

    const newRatesData: ExchangeRate[] = [];
    this.exchangeRateData.forEach((rate) => {
      newRatesData.push(...rate.adjustForOverlap(newRate));
    });
    this.exchangeRateData = newRatesData;

    this.exchangeRateData.push(newRate);
  }

  public convert(input: ConvertInput) {
    const inputDate = new Date(input.date);
    const sourceRates = this.getSingleRate(input.from, inputDate);

    if (sourceRates.length !== 1) {
      throw Error('An error occurred when searching the source rate.');
    }

    const localAmount = sourceRates[0].calculateLocal(input.amount);

    const targetRates = this.getSingleRate(input.to, inputDate);

    if (targetRates.length !== 1) {
      throw Error('An error occurred when searching the target rate.');
    }
    return localAmount / targetRates[0].exchangeRate;
  }

  private getSingleRate(isoCode: string, date: Date) {
    return this.exchangeRateData.filter(
      (rate) => rate.isoCode == isoCode && rate.hasDate(date),
    );
  }

  private loadRatesFromFile(filePath: string): void {
    const data = fs.readFileSync(filePath);
    const jsonData = JSON.parse(data.toString());
    const exchangeRates: ExchangeRate[] = [];

    jsonData.forEach((element: any) => {
      exchangeRates.push(
        new ExchangeRate(
          element.isoCode,
          element.exchangeRate,
          new Date(element.startDate),
          new Date(element.endDate),
        ),
      );
    });

    this.exchangeRateData.push(...exchangeRates);
  }
}
