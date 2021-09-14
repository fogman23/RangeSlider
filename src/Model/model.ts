export default class SliderModel implements Model {
  private minValue: number;
  private maxValue: number;
  private step: number;
  private lowerValue: number;
  private upperValue: number | null;
  private observers: Set<Object>;

  constructor(options: Model.Options) {
    this.minValue = options.minValue;
    this.maxValue = options.maxValue;
    this.step = options.step;
    this.lowerValue = options.lowerValue;
    this.upperValue = options.upperValue;

    this.observers = new Set();
  }

  addObserver(observer: Model.Observer): void {
    this.observers.add(observer);
  }

  removeObserver(observer: Model.Observer): void {
    this.observers.delete(observer);
  }

  getState(): Model.Options {
    return {
      minValue: this.minValue,
      maxValue: this.maxValue,
      step: this.step,
      lowerValue: this.lowerValue,
      upperValue: this.upperValue,
    }
  }

  updateState(state: Model.Options): void {}

  notify(): void {
    this.observers.forEach((observer: Model.Observer): void => {
      observer.update();
    });
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
