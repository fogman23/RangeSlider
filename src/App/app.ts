import Model from '../Model/model';
import View from '../View/view';
import Presenter from '../Presenter/presenter';

interface Options {
  minValue: number,
  maxValue: number,
  step: number,
  lowerValue: number,
  upperValue: null | number
}

export default class App {
  private options: Options;
  private model: Model;
  private view: View;
  private presenter: Presenter;
  private $container: JQuery

  constructor(options: Options, $container: JQuery) {
    this.options = options;
    this.$container = $container;
    this.model = new Model();
    this.presenter = new Presenter();
    this.view = new View();
  }
}