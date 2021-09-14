declare interface Model {
<<<<<<< HEAD
  getState(): Model.Options,
  updateState(state: Model.Options): void,
  setValue(value: number): void,
  addObserver(observer: Model.Observer): void,
  removeObserver(observer: Model.Observer): void
=======

>>>>>>> 90c1c0b755b4b358413660548940ac94f03f481e
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
<<<<<<< HEAD
    update(): void
=======
    update: () => {}
>>>>>>> 90c1c0b755b4b358413660548940ac94f03f481e
  }
}