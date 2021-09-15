declare interface Model {
  getState(): Model.Options,
  updateState(state: Model.Options): void,
  setValue(value: number): void,
  addObserver(observer: Model.Observer): void,
  removeObserver(observer: Model.Observer): void
}

declare namespace Model {
  interface Options {
    minValue?: number;
    maxValue?: number;
    step?: number;
    lowerValue?: number;
    upperValue?: number | null;
  }

  interface Observer {
    update(): void
  }
}