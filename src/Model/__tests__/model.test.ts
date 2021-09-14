import Model from '../model';
import { Options, Observer } from '../model';

describe('model', () => {
  const testOptions: Options = {
    minValue: 0,
    maxValue: 50,
    step: 2,
    lowerValue: 5,
    upperValue: null,
  };
  let testModel: Model,
    updateFn: () => {},
    anotherUpdateFn: () => {},
    observer: Observer,
    anotherObserver: Observer;

  beforeEach( () => {
    testModel = new Model(testOptions);
    updateFn = jest.fn();
    anotherUpdateFn = jest.fn();
    observer = {
      update: updateFn
    };
    anotherObserver = {
      update: anotherUpdateFn
    }
  })

  afterEach( () => {
    testModel = null;
  })

  test('create instanse of Model without options', () => {
    const modelDefaultOptions = new Model();

    expect(modelDefaultOptions).toBeInstanceOf(Model);
    expect(modelDefaultOptions.getValue()).toBe(10);
    expect(modelDefaultOptions).toHaveProperty('minValue', 0);
    expect(modelDefaultOptions).toHaveProperty('maxValue', 100);
    expect(modelDefaultOptions).toHaveProperty('step', 1);
  })

  test('incValue should adds step to the lowerValue', () => {
    testModel.incValue();
    expect(testModel.getValue()).toBe(7);

    testModel.incValue();
    testModel.incValue();
    testModel.incValue();
    expect(testModel.getValue()).toBe(13);
  })

  test('if lowerValue is greater than maxValue then lowerValue is equal to maxValue', () => {
    for (let i = 0; i < 55; i++) {
      testModel.incValue();
    }

    expect(testModel.getValue()).toBe(50);

    testModel.incValue();
    expect(testModel.getValue()).toBe(50);
  })

  test('decValue should subtract step from the lowerValue', () => {
    testModel.decValue();
    expect(testModel.getValue()).toBe(3);

    testModel.decValue();
    expect(testModel.getValue()).toBe(1);
  })

  test('if lowerValue is less than minValue, then lowerValue is equal to minValue', () => {
    testModel.decValue();
    testModel.decValue();
    testModel.decValue();

    expect(testModel.getValue()).toBe(0);

    testModel.decValue();
    expect(testModel.getValue()).toBe(0);
  })

  test('setValue should set the lowerValue', () => {
    testModel.setValue(12);
    expect(testModel.getValue()).toBe(12);

    testModel.setValue(4);
    expect(testModel.getValue()).toBe(4);
  })

  test('if the arguments of the setValue is greater than the maxValue, then show error', () => {
    expect(() => {
      testModel.setValue(60);
    }).toThrowError("заданное значение больше максимального");
  })


  test('if the arguments of the setValue is less that the minValue, then show error', () => {
    expect(() => {
      testModel.setValue(-13);
    }).toThrowError("заданное значение меньше минимального");
  })

  test('addObserver should added observer to this.observers', () => {
    expect(testModel).toHaveProperty('observers');
    testModel.addObserver(observer);

    const entries = Object.entries(testModel);
    entries.forEach((entry: [string, any], index: number) => {
      if (entry[0] === 'observers') {
        expect(entry[1].has(observer)).toBeTruthy();
      }
    });
  })

  test('removeObserver should removed observer', () => {
    expect(testModel).toHaveProperty('observers');
    const entries = Object.entries(testModel);

    testModel.addObserver(observer);
    entries.forEach((entry: [string, any], index: number) => {
      if (entry[0] === 'observers') {
        expect(entry[1].has(observer)).toBeTruthy();
      }
    });

    testModel.removeObserver(observer);
    entries.forEach((entry: [string, any], index: number) => {
      if (entry[0] === 'observers') {
        expect(entry[1].has(observer)).toBeFalsy();
      }
    });
  })

  test('if the lowerValue changes, the model should notyfy observers', () => {
    testModel.addObserver(observer);
    testModel.addObserver(anotherObserver);

    testModel.incValue();
    expect(updateFn).toHaveBeenCalledTimes(1);
    testModel.incValue();
    testModel.incValue();
    testModel.incValue();
    expect(updateFn).toHaveBeenCalledTimes(4);
    expect(anotherUpdateFn).toHaveBeenCalledTimes(4);

    testModel.decValue();
    expect(updateFn).toHaveBeenCalledTimes(5);
    expect(anotherUpdateFn).toHaveBeenCalledTimes(5);

    testModel.setValue(10);
    expect(updateFn).toHaveBeenCalledTimes(6);
    expect(anotherUpdateFn).toHaveBeenCalledTimes(6);
  })

  test('if the lowerValue does not changes, the model should not notify observers', () => {
    testModel.addObserver(observer);
    const currentLowerValue = testModel.getValue();

    testModel.setValue(currentLowerValue);
    expect(updateFn).not.toHaveBeenCalled();
  })
})