declare interface View {
<<<<<<< HEAD
  render(data: View.Data): void,
  update(data: View.Data): void,
  addObserver(observer: View.Observer): void,
  removeObserver(observer: View.Observer): void
=======
  
>>>>>>> 90c1c0b755b4b358413660548940ac94f03f481e
}

declare namespace View {
  interface Observer {
<<<<<<< HEAD
    update(value: number): void
  }

  interface Data {
    value: number,
    step: number,
    interval: [number, number],
=======
    update: (value: number) => {}
>>>>>>> 90c1c0b755b4b358413660548940ac94f03f481e
  }
}