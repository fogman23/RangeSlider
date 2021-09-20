export default class SliderPresenter implements Presenter {
  private model: Model;
  private view: View;
  private modelObserver: Model.Observer;
  private viewObserver: View.Observer;
  private dataValues: number[];

  constructor(options: Presenter.Options) {
    this.model = options.model;
    this.view = options.view;

    this.subscribeToModel();
    this.subscribeToView();

    if (options.dataValues !== undefined) {
      this.dataValues = options.dataValues;
    } else {
      this.dataValues = this.createDataValues();
    }

    this.renderView();
  }

  private renderView(): void {
    this.view.render(this.dataValues);
  }

  update(options: App.Options): void {}

  updateModel(updateData: Model.Options): void {}

  updateView(renderData: View.Options): void {}

  getModelData(): Model.Options {
    return this.model.getState();
  }

  getViewData(): View.Options {
    return this.view.getData();
  }

  getPresenterData(): number[] {
    return this.dataValues;
  }

  private createDataValues(): number[] {
    const { minValue: min, maxValue: max, step } = this.model.getState();

    const dataValues: number[] = [];

    for (let i = min; i <= max; i += step) {
      dataValues.push(i);
    }

    return dataValues;
  }

  private subscribeToModel(): void {
    this.modelObserver = {
      update: (): void => {},
    };
    this.model.addObserver(this.modelObserver);
  }

  private subscribeToView(): void {
    this.viewObserver = {
      update: (value: number): void => {},
    };
    this.view.addObserver(this.viewObserver);
  }
}
