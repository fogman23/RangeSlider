declare namespace App {
  interface Options {
    minValue: number;
    maxValue: number;
    step: number;
    lowerValue: number;
    upperValue: null | number;

    orientation: 'horizontal' | 'vertical';
    range: boolean;
    bar: boolean;
    scale: boolean;
    tooltip: boolean;

    onStart: CallableFunction;
    onChange: CallableFunction;
    onFinish: CallableFunction;
    onUpdate: CallableFunction;
  }
}