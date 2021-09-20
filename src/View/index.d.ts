declare interface View {
  getData(): View.Options;
  render(dataValues: number[]): void;
  update(data: View.Data): void;
  addObserver(observer: View.Observer): void;
  removeObserver(observer: View.Observer): void;
}

declare namespace View {
  interface Observer {
    update(value: number): void;
  }
  
  interface Options {
    orientation: 'horizontal' | 'vertical';
    range: boolean;
    bar: boolean;
    scale: boolean;
    tooltip: boolean;
  }

  interface Data {
    value: number;
    step: number;
    interval: [number, number];
  }
}