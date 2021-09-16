export default class SliderModel implements Model {
  private _minValue: number;
  private _maxValue: number;
  private _step: number;
  private _lowerValue: number;
  private _upperValue: number | null;
  private observers: Set<Object>;
  private isUpdated: boolean;
  private readyNotify: boolean;

  constructor(options: Model.Options) {
    this.minValue = options.minValue;
    this.maxValue = options.maxValue;
    this.step = options.step;
    this.lowerValue = options.lowerValue;
    if (options.upperValue !== undefined) {
      this.upperValue = options.upperValue;
    }
    this.observers = new Set();
    this.isUpdated = true;
    this.readyNotify = true;
  }

  addObserver(observer: Model.Observer): void {
    this.observers.add(observer);
  }

  removeObserver(observer: Model.Observer): void {
    this.observers.delete(observer);
  }

  getState(): Model.Options {
    return {
      minValue: this._minValue,
      maxValue: this._maxValue,
      step: this._step,
      lowerValue: this._lowerValue,
      upperValue: this._upperValue,
    };
  }

  updateState(state: Model.Options): void {
    const { maxValue, minValue, step, lowerValue, upperValue } = state;

    this.readyNotify = false;

    this.maxValue = maxValue !== undefined ? maxValue : this._maxValue;
    this.minValue = minValue !== undefined ? minValue : this._minValue;
    this.step = step !== undefined ? step : this._step;
    this.lowerValue = lowerValue !== undefined ? lowerValue :this._lowerValue;
    this.upperValue = upperValue !== undefined ? upperValue :this._upperValue;

    this.readyNotify = true;
    this.notify();
  }

  get lowerValue() {
    return this._lowerValue
  }

  set lowerValue(value: number) {
    const { _minValue, _maxValue, _step } = this;

    if (this._lowerValue === undefined) {
      this._lowerValue = this._minValue;
    }

    if (this._lowerValue === value && this.isUpdated) {
      return;
    }

    const valueMultipleStep =
      (value % _step) / _step > 0.5
        ? value - (value % _step) + _step
        : value - (value % _step);

    if (valueMultipleStep >= _maxValue) {
      this._lowerValue = _maxValue;
      this.isUpdated = false;
    } else if (valueMultipleStep <= _minValue) {
      this._lowerValue = _minValue;
      this.isUpdated = false;
    } else {
      this._lowerValue = valueMultipleStep;
      this.isUpdated = false;
    }

    if (this.observers !== undefined && this._upperValue === undefined) {
      this.notify();
    }
  }

  get upperValue() {
    return this._upperValue;
  }

  set upperValue(value: number) {
    const { _minValue, _maxValue, _step } = this;

    if (this._upperValue === value && this.isUpdated) {
      return;
    }

    const valueMultipleStep =
      (value % _step) / _step > 0.5
        ? value - (value % _step) + _step
        : value - (value % _step);

    if (valueMultipleStep >= _maxValue) {
      this._upperValue = _maxValue;
      this.isUpdated = false;
    } else if (valueMultipleStep <= _minValue) {
      this._upperValue = _minValue;
      this.isUpdated = false;
    } else {
      this._upperValue = valueMultipleStep;
      this.isUpdated = false;
    }

    if (this.observers !== undefined) {
      this.notify();
    }
  }

  get minValue() {
    return this._minValue;
  }

  set minValue(value: number) {
    if (this._maxValue === undefined || value < this._maxValue) {
      this._minValue = value;
      this.isUpdated = false;
      if (this._lowerValue !== undefined) {
        this.lowerValue = this._lowerValue;
      }
      if (this._upperValue !== undefined) {
        this.upperValue = this._upperValue;
      }
    }
  }

  get maxValue() {
    return this._maxValue;
  }

  set maxValue(value: number) {
    if (this._minValue === undefined || value > this._minValue) {
      this._maxValue = value;
      this.isUpdated = false;
      if (this._lowerValue !== undefined) {
        this.lowerValue = this._lowerValue;
      }
      if (this._upperValue !== undefined) {
        this.upperValue = this._upperValue;
      }
    }
  }

  get step() {
    return this._step;
  }

  set step(value: number) {
    if (value > 0) {
      this._step = value;
      this.isUpdated = false;
      if (this._lowerValue !== undefined) {
        this.lowerValue = this._lowerValue;
      }
      if (this._upperValue !== undefined) {
        this._upperValue = this._upperValue;
      }
    }
  }

  notify(): void {
    if (this.observers.size !== 0 && this.readyNotify) {
      this.observers.forEach((observer: Model.Observer): void => {
        observer.update();
      });
    }
    this.isUpdated = true;
  }

}
