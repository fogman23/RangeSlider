declare interface View {
  getData(): View.Options;
  render(renderData: View.RenderData): void;
  update(options: View.Options): void;
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

  interface RenderData {
    data: Array<number | string>;
    value: number;
  }
}