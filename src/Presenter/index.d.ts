declare interface Presenter {
  update(options: App.Options): void
  getModelData(): Model.Options;
  getViewData(): View.Options;
  getPresenterData(): Presenter.Data;
}

declare namespace Presenter {
  interface Options {
    model: Model;
    view: View;
    dataValues?: Array<number | string>;
    onChange: CallableFunction;
    onUpdate: CallableFunction;
  }

  interface Data {
    dataValues: Array<number | string>;
    renderData: Array<number | string>;
  }
}