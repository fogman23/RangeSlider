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
    this.setValue(options.lowerValue);
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
    };
  }

  updateState(state: Model.Options): void {
    const { maxValue, minValue, step, lowerValue } = state;

    this.maxValue = maxValue ? maxValue : this.maxValue;
    this.minValue = minValue ? minValue : this.minValue;
    this.step = step ? step : this.step;

    this.setValue(lowerValue);
  }

  notify(): void {
    if (this.observers.size !== 0) {
      this.observers.forEach((observer: Model.Observer): void => {
        observer.update();
      });
    }
  }

  setValue(value: number): void {
    const { minValue, maxValue, step } = this;

    if (!this.lowerValue) {
      this.lowerValue = this.minValue;
    }

    const valueMultipleStep =
      (value % step) / step > 0.5
        ? value - (value % step) + step
        : value - (value % step);

    if (this.lowerValue === valueMultipleStep) {
      return;
    }

    if (valueMultipleStep >= maxValue) {
      this.lowerValue = maxValue;
    } else if (valueMultipleStep <= minValue) {
      this.lowerValue = minValue;
    } else {
      this.lowerValue = valueMultipleStep;
    }

    this.notify();
  }

  setMinValue(value: number): void {
    if (value < this.maxValue) {
      this.minValue = value;
    }
  }

  setMaxValue(value: number): void {
    if (value > this.minValue) {
      this.maxValue = value;
    }
  }

  setStep(value: number): void {
    if (value > 0) {
      this.step = value;
    }
  }
}
