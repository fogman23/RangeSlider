interface Options {
  minValue: number;
  maxValue: number;
  step: number;
  lowerValue: number;
  upperValue: number | null;
}

export default class Model {
  private minValue: number;
  private maxValue: number;
  private step: number;
  private lowerValue: number;
  private upperValue: number | null;

  constructor(options?: Options) {
    if (options) {
      this.minValue = options.minValue;
      this.maxValue = options.maxValue;
      this.step = options.step;
      this.lowerValue = options.lowerValue;
      this.upperValue = options.upperValue;
    } else {
      this.minValue = 0;
      this.maxValue = 100;
      this.step = 1;
      this.lowerValue = 10;
      this.upperValue = null;
    }
  }

  getValue(): number {
    return this.lowerValue;
  }

  incValue(): void {
    const newValue = this.lowerValue + this.step;
    newValue >= this.maxValue
      ? (this.lowerValue = this.maxValue)
      : (this.lowerValue = newValue);
  }

  decValue(): void {
    const newValue = this.lowerValue - this.step;
    newValue <= this.minValue
      ? (this.lowerValue = this.minValue)
      : (this.lowerValue = newValue);
  }

  setValue(value: number): void {
    if (value > this.maxValue) {
      throw new RangeError("заданное значение больше максимального");
    } else if (value < this.minValue) {
      throw new RangeError("заданное значение меньше минимального");
    } else {
      this.lowerValue = value;
    }
  }
}

export { Options };
