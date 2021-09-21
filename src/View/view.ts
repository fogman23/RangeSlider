import $ from 'jquery';
import './view.scss';

export default class SliderView implements View {
  private $container: JQuery;
  private $target: JQuery;
  private $base: JQuery;
  private observers: Set<View.Observer>;
  private isRendered: boolean;

  constructor(container: HTMLElement) {
    this.$container = $(container);
    this.$target = $('<div>', { class: 'slider-target' });
    this.$base = $('<div>', { class: 'slider-base' });
    this.observers = new Set();
    this.isRendered = false;
  }

  render(dataValues: Array<number | string>): void {
    if (!this.isRendered) {
      this.$container.append(this.$target);
      this.$target.append(this.$base);
      this.attachEventListener();
      this.isRendered = true;
    } else {
      throw Error('View is already rendered!');
    }
    
  }

  update(options: View.Options): void {}

  addObserver(observer: View.Observer): void {
    this.observers.add(observer);
  }

  removeObserver(observer: View.Observer): void {
    this.observers.delete(observer);
  }

  notify(value: number): void {
    this.observers.forEach((observer: View.Observer): void => {
      observer.update(value);
    });
  }

  getData(): View.Options {
    return 
  }

  private attachEventListener() {
    this.$base.on('click', (event) => {
      const base = event.currentTarget;
      const value = Math.floor((event.clientX - base.offsetLeft) / base.offsetWidth * 100);
      this.notify(value);
    });
  }
}