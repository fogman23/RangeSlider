export default class Model {
  private minValue: number;
  private maxValue: number;
  private step: number;
  private lowerValue: number;
  private upperValue: number | null;
  private observers: Set<Object>;

  constructor(options?: Model.Options) {
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
    this.observers = new Set();
  }

  addObserver(observer: Model.Observer): void {
    this.observers.add(observer);
  }

  removeObserver(observer: Model.Observer): void {
    this.observers.delete(observer);
  }

  notify(): void {
    this.observers.forEach( (observer: Model.Observer): void => {
      observer.update();
    })
  }

  getValue(): number {
    return this.lowerValue;
  }

  incValue(): void {
    const { maxValue, step } = this;
    const newValue = this.lowerValue + step;
    newValue >= maxValue
      ? this.setValue(maxValue)
      : this.setValue(newValue);
  }

  decValue(): void {
    const { minValue, step } = this;
    const newValue = this.lowerValue - step;
    newValue <= minValue
      ? this.setValue(minValue)
      : this.setValue(newValue);
  }

  setValue(value: number): void {
    if (value > this.maxValue) {
      throw new RangeError("заданное значение больше максимального");
    } else if (value < this.minValue) {
      throw new RangeError("заданное значение меньше минимального");
    } else if (value !== this.lowerValue) {
      this.lowerValue = value;
      this.notify();
    }
  }
}
