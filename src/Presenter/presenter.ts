import Model from '../Model/model';
import View from '../View/view';

export default class Presenter {
  private model: Model;
  private view: View;
  private modelObserver: Model.Observer;
  private viewObserver: View.Observer;
}