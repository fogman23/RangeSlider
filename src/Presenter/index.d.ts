declare interface Presenter {
  renderView(renderData: View.Data): void;
  updateModel(updateData: Model.Options): void;
}