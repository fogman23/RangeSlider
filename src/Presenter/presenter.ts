import SliderModel from '../Model/model';
import SliderView from '../View/view';

export default class SliderPresenter implements Presenter {
  private model: SliderModel;
  private view: SliderView;
  private modelObserver: Model.Observer;
  private viewObserver: View.Observer;

  constructor(model: SliderModel, view: SliderView) {
    this.model = model;
    this.view = view;

    this.viewObserver = {
      update: (value: number) => {}
    }
    this.modelObserver = {
      update: () => {}
    }
    this.subscribeModelObserver(this.modelObserver);
    this.subscribeViewObserver(this.viewObserver);

  }

  renderView(renderData: View.Data): void {}

  updateModel(updateData: Model.Options): void {}

  private subscribeModelObserver(observer: Model.Observer): void {
    this.model.addObserver(observer);
  }

  private subscribeViewObserver(observer: View.Observer): void {
    this.view.addObserver(observer);
  }
}