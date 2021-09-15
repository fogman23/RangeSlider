declare interface View {
  render(data: View.Data): void,
  update(data: View.Data): void,
  addObserver(observer: View.Observer): void,
  removeObserver(observer: View.Observer): void
}

declare namespace View {
  interface Observer {
    update(value: number): void
  }

  interface Data {
    value: number,
    step: number,
    interval: [number, number],
    update: (value: number) => {}
  }
}