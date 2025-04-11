import assert from 'node:assert';

export class ExchangeRate {
  public readonly exchangeRate: number;
  public readonly isoCode: string;
  public readonly startDate: Date;
  public readonly endDate: Date;

  constructor(
    isoCode: string,
    exchangeRate: number,
    startDate: Date,
    endDate: Date,
  ) {
    if (startDate > endDate) {
      throw new Error('startDate must be before endDate');
    }

    this.isoCode = isoCode;
    this.exchangeRate = exchangeRate;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  public hasDate(date: Date): boolean {
    return date >= this.startDate && date <= this.endDate;
  }

  public calculateLocal(amount: number): number {
    return amount * this.exchangeRate;
  }

  public isSubrangeOf(other: ExchangeRate): boolean {
    if (this.isoCode !== other.isoCode) {
      return false;
    }
    return this.startDate >= other.startDate && other.endDate >= this.endDate;
  }

  public overlapsWith(other: ExchangeRate): boolean {
    return this.startDate < other.endDate && other.startDate < this.endDate;
  }

  public adjustForOverlap(newRate: ExchangeRate): ExchangeRate[] {
    if (this.isoCode !== newRate.isoCode || !this.overlapsWith(newRate)) {
      return [this];
    }
    assert(
      !this.isSubrangeOf(newRate),
      'This rate should already be filtered out',
    );

    const segments: ExchangeRate[] = [];

    if (newRate.startDate > this.startDate) {
      segments.push(
        new ExchangeRate(
          this.isoCode,
          this.exchangeRate,
          this.startDate,
          newRate.startDate,
        ),
      );
    }

    if (newRate.endDate < this.endDate) {
      segments.push(
        new ExchangeRate(
          this.isoCode,
          this.exchangeRate,
          newRate.endDate,
          this.endDate,
        ),
      );
    }

    return segments;
  }
}
