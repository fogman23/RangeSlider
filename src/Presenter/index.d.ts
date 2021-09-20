declare interface Presenter {
  update(options: App.Options): void
  updateModel(updateData: Model.Options): void;
  updateView(renderData: View.Options): void
  getModelData(): Model.Options;
  getViewData(): View.Options;
  getPresenterData(): number[];
}

declare namespace Presenter {
  interface Options {
    model: Model;
    view: View;
    dataValues?: number[];
    onStart: CallableFunction;
    onChange: CallableFunction;
    onFinish: CallableFunction;
    onUpdate: CallableFunction;
  }
}