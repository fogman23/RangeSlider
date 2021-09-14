declare interface Model {

}

declare namespace Model {
  interface Options {
    minValue: number;
    maxValue: number;
    step: number;
    lowerValue: number;
    upperValue: number | null;
  }

  interface Observer {
    update: () => {}
  }
}