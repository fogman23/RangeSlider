/**
 * @jest-environment jsdom
 */
import $ from 'jquery';
import View from '../view';

describe("View", () => {
  document.body.innerHTML = `<div id="container"></div>`;
  const testNode = document.getElementById('container');
  let testView: View,
    observer: View.Observer,
    anotherObserver: View.Observer,
    entries: Array<any>,
    keys: Set<string>,
    updateFn: jest.Mock,
    anotherUpdateFn: jest.Mock,
    data: View.Data,
    tempOffsetWidth: number,
    tempOffsetLeft: number;

  beforeEach( () => {
    testView = new View(testNode);
    updateFn = jest.fn(x => x + 1);
    anotherUpdateFn = jest.fn(x => x + 2);
    data = {
      value: 20,
      step: 2,
      interval: [0, 100]
    };
    observer = {
      update: updateFn
    };
    anotherObserver = {
      update: anotherUpdateFn
    };
    entries = Object.entries(testView);
    keys = new Set (Object.keys(testView));
    tempOffsetWidth = 300;
    tempOffsetLeft = 25;

    Object.defineProperties(HTMLElement.prototype, {
      'offsetLeft': { 'value': tempOffsetLeft, 'configurable': true},
      'offsetWidth': { 'value': tempOffsetWidth, 'configurable': true}
    })
  })

  test('constructor should return object with some props', () => {
    expect(testNode).not.toBeUndefined();

    entries.forEach( (entry: [string, any]) => {
      if (entry[0] === '$containder') expect($(testNode)).toEqual(entry[0])
    })

    expect(keys.has('$container')).toBeTruthy();
    expect(keys.has('$target')).toBeTruthy();
    expect(keys.has('observers')).toBeTruthy();
  })

  test('render should append div.slider-target to container and append div.slider-base to div.slider-target only once', () => {
    testView.render(data);
    expect(() => testView.render(data)).toThrowError('View is already rendered!')
    expect($('.slider-target').length).toBe(1)
    expect($('.slider-base').length).toBe(1)
  })

  test('addObserver should added observer to this.observers', () => {
    expect(testView).toHaveProperty('observers');
    testView.addObserver(observer);

    entries = Object.entries(testView);
    entries.forEach((entry: [string, any]) => {
      if (entry[0] === 'observers') {
        expect(entry[1].has(observer)).toBeTruthy();
      }
    });
  })

  test('removeObserver should removed observer', () => {
    expect(testView).toHaveProperty('observers');
    entries = Object.entries(testView);

    testView.addObserver(observer);
    entries.forEach((entry: [string, any]) => {
      if (entry[0] === 'observers') {
        expect(entry[1].has(observer)).toBeTruthy();
      }
    });

    testView.removeObserver(observer);
    entries.forEach((entry: [string, any]) => {
      if (entry[0] === 'observers') {
        expect(entry[1].has(observer)).toBeFalsy();
      }
    });
  })

  test('attachEventListener added eventListener to target, which calls notify fn', () => {
    testView.render(data);
    testView.addObserver(observer);
    testView.addObserver(anotherObserver);

    const eventClientX: number = 50;
    const clickEvent = $.Event('click', {clientX: eventClientX});
    $('.slider-base').trigger(clickEvent);

    const result: number = Math.floor((eventClientX - tempOffsetLeft) / tempOffsetWidth * 100);

    expect(updateFn).toHaveBeenCalled();
    expect(updateFn.mock.calls[0][0]).toBe(result);
    expect(anotherUpdateFn).toHaveBeenCalled();
    expect(anotherUpdateFn.mock.calls[0][0]).toBe(result);
  })
})