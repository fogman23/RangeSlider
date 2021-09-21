export default class SliderPresenter implements Presenter {
  private model: Model;
  private view: View;
  private modelObserver: Model.Observer;
  private viewObserver: View.Observer;
  private dataValues: Array<number | string>;
  private renderData: Array<number | string>;
  private onChange: CallableFunction;
  private onUpdate: CallableFunction;

  constructor(options: Presenter.Options) {
    this.model = options.model;
    this.view = options.view;
    
    if (options.dataValues !== undefined) {
      this.dataValues = options.dataValues;
    } else {
      this.dataValues = [];
    }

    this.renderData = this.createDataValues();

    this.onChange = options.onChange;
    this.onUpdate = options.onUpdate;
    
    this.subscribeToModel();
    this.subscribeToView();
    this.renderView();
  }

  private renderView(): void {
    this.view.render(this.renderData);
  }

  update(options: App.Options): void {
    const modelOptions: Model.Options = {
      minValue: options.minValue,
      maxValue: options.maxValue,
      step: options.step,
      lowerValue: options.lowerValue,
      upperValue: options.upperValue,
    };

    const viewOptions: View.Options = {
      orientation: options.orientation,
      range: options.range,
      bar: options.bar,
      scale: options.scale,
      tooltip: options.tooltip,
    };

    this.model.updateState(modelOptions);
    this.view.update(viewOptions);

    if (options.dataValues !== undefined) {
      this.dataValues = options.dataValues;
      this.renderData = this.createDataValues();
    }

    this.onUpdate();
  }

  getModelData(): Model.Options {
    return this.model.getState();
  }

  getViewData(): View.Options {
    return this.view.getData();
  }

  getPresenterData(): Presenter.Data {
    return {
      dataValues: this.dataValues,
      renderData: this.renderData,
    };
  }

  getAllData(): App.Options {
    return {
      ...this.getModelData(),
      ...this.getViewData(),
      ...this.getPresenterData(),
    };
  }

  private createDataValues(): Array<number | string> {
    if (this.dataValues.length > 0) {
      return this.dataValues;
    }
    
    const { minValue: min, maxValue: max, step } = this.model.getState();

    const dataValues: Array<number | string> = [];

    for (let i = min; i <= max; i += step) {
      dataValues.push(i);
    }

    return dataValues;
  }

  private subscribeToModel(): void {
    this.modelObserver = {
      update: (): void => {
        const newModelData = this.getModelData();
      },
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
