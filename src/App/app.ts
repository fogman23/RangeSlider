import SliderModel from '../Model/model';
import SliderView from '../View/view';
import SliderPresenter from '../Presenter/presenter';

export default class App {
  private options: App.Options;
  private model: SliderModel;
  private view: SliderView;
  private presenter: SliderPresenter;
  private $container: JQuery;

  constructor(options: App.Options, container: HTMLElement) {
    this.options = options;
    this.$container = $(container);
    this.model = new SliderModel(this.options);
    this.view = new SliderView(container);
    this.presenter = new SliderPresenter(this.model, this.view);
  }
}