declare interface Model {
  minValue: number,
  maxValue: number,
  step: number,
  lowerValue: number,
  upperValue: number | null,
  getState(): Model.Options,
  updateState(state: Model.Options): void,
  addObserver(observer: Model.Observer): void,
  removeObserver(observer: Model.Observer): void
}

declare namespace Model {
  interface Options {
    minValue?: number,
    maxValue?: number,
    step?: number,
    lowerValue?: number,
    upperValue?: number | null,
  }

  interface Observer {
    update(): void,
  }
}