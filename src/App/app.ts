import Model, { ModelOptions } from '../Model/model';
import View from '../View/view';
import Presenter from '../Presenter/presenter';

interface AppOptions {
  minValue: number,
  maxValue: number,
  step: number,
  lowerValue: number,
  upperValue: null | number
}

export default class App {
  private options: AppOptions;
  private model: Model;
  private view: View;
  private presenter: Presenter;
  private $container: JQuery

  constructor(options: AppOptions, container: HTMLElement) {
    this.options = options;
    this.$container = $(container);
    this.model = new Model(options);
    this.presenter = new Presenter();
    this.view = new View(container);
  }
}