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

    if (maxValue !== undefined) {
      this.maxValue = maxValue;
    }
    if (minValue !== undefined) {
      this.minValue = minValue;
    }
    if (step !== undefined) {
      this.step = step;
    }
    if (lowerValue !== undefined) {
      this.lowerValue = lowerValue;
    }
    if (upperValue !== undefined) {
      this.upperValue = upperValue;
    }
    this.readyNotify = true;
    this.notify();
  }

  get lowerValue() {
    return this._lowerValue;
  }

  set lowerValue(value: number) {
    if (this.validate(value)) {
      const { _minValue, _maxValue, _step, _lowerValue: oldValue, _upperValue } = this;

      if (this._lowerValue === undefined) {
        this._lowerValue = this._minValue;
      }

      const valueMultipleStep =
        (value % _step) / _step > 0.5
          ? value - (value % _step) + _step
          : value - (value % _step);
      
      if (_upperValue !== undefined && valueMultipleStep >= _upperValue) {
        this._lowerValue = _upperValue;
        this.isUpdated = false;
      }  else if (valueMultipleStep >= _maxValue) {
        this._lowerValue = _maxValue;
        this.isUpdated = false;
      } else if (valueMultipleStep <= _minValue) {
        this._lowerValue = _minValue;
        this.isUpdated = false;
      } else {
        this._lowerValue = valueMultipleStep;
        this.isUpdated = false;
      }

      if (oldValue !== this._lowerValue) {
        this.notify();
      }
    }
  }

  get upperValue() {
    return this._upperValue;
  }

  set upperValue(value: number) {
    if (this.validate(value)) {
      const { _maxValue, _step, _lowerValue, _upperValue: oldValue } = this;

      const valueMultipleStep =
        (value % _step) / _step > 0.5
          ? value - (value % _step) + _step
          : value - (value % _step);

      if (valueMultipleStep >= _maxValue) {
        this._upperValue = _maxValue;
        this.isUpdated = false;
      } else if (valueMultipleStep <= _lowerValue) {
        this._upperValue = _lowerValue;
        this.isUpdated = false;
      } else {
        this._upperValue = valueMultipleStep;
        this.isUpdated = false;
      }

      if (oldValue !== this._upperValue) {
        this.notify();
      }
    }
  }

  get minValue() {
    return this._minValue;
  }

  set minValue(value: number) {
    if (this.validate(value)) {
      if (this._maxValue === undefined || value < this._maxValue) {
        this._minValue = value;
        this.isUpdated = false;
        if (this._lowerValue !== undefined) {
          this.lowerValue = this._lowerValue;
        }
        if (this._upperValue !== undefined) {
          this.upperValue = this._upperValue;
        }
        if (!this.isUpdated) {
          this.notify();
        }
      }
    }
  }

  get maxValue() {
    return this._maxValue;
  }

  set maxValue(value: number) {
    if (this.validate(value)) {
      if (this._minValue === undefined || value > this._minValue) {
        this._maxValue = value;
        this.isUpdated = false;
        if (this._lowerValue !== undefined) {
          this.lowerValue = this._lowerValue;
        }
        if (this._upperValue !== undefined) {
          this.upperValue = this._upperValue;
        }
        if (!this.isUpdated) {
          this.notify();
        }
      }
    }
  }

  get step() {
    return this._step;
  }

  set step(value: number) {
    if (this.validate(value)) {
      if (value > 0) {
        this._step = value;
        this.isUpdated = false;
        if (this._lowerValue !== undefined) {
          this.lowerValue = this._lowerValue;
        }
        if (this._upperValue !== undefined) {
          this.upperValue = this._upperValue;
        }
        if (!this.isUpdated) {
          this.notify();
        }
      }
    }
  }

  notify(): void {
    if (
      this.observers !== undefined &&
      this.observers.size !== 0 &&
      this.readyNotify
    ) {
      this.observers.forEach((observer: Model.Observer): void => {
        observer.update();
      });
    }
    this.isUpdated = true;
  }

  private validate(value: any): boolean {
    return !(value === null || isNaN(value) || !isFinite(value));
  }
}
