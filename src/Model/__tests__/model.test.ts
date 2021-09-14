import SliderModel from '../model';

describe('model', () => {
  const testOptions: Model.Options = {
    minValue: 0,
    maxValue: 50,
    step: 2,
    lowerValue: 5,
    upperValue: null,
  };
  let testModel: SliderModel,
    updateFn: jest.Mock,
    anotherUpdateFn: jest.Mock,
    observer: Model.Observer,
    anotherObserver: Model.Observer;

  beforeEach( () => {
    testModel = new SliderModel(testOptions);
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

  test('constructor should set instance properties', () => {
    expect(testModel).toBeInstanceOf(SliderModel);
    expect(testModel).toHaveProperty('minValue', 0);
    expect(testModel).toHaveProperty('maxValue', 50);
    expect(testModel).toHaveProperty('step', 2);
    expect(testModel).toHaveProperty('lowerValue', 5);
    expect(testModel).toHaveProperty('upperValue', null);
  })

  test('getState should returns model state object', () => {
    expect(testModel.getState()).toBeInstanceOf(Object)

    const state = testModel.getState();

    expect(state).toHaveProperty('minValue', 0);
    expect(state).toHaveProperty('maxValue', 50);
    expect(state).toHaveProperty('step', 2);
    expect(state).toHaveProperty('lowerValue', 5);
    expect(state).toHaveProperty('upperValue', null);
  })

  test('setValue should set the lowerValue', () => {
    testModel.setValue(12);
    expect(testModel.getState().lowerValue).toBe(12);

    testModel.setValue(4);
    expect(testModel.getState().lowerValue).toBe(4);
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
    entries.forEach((entry: [string, any]) => {
      if (entry[0] === 'observers') {
        expect(entry[1].has(observer)).toBeTruthy();
      }
    });
  })

  test('removeObserver should removed observer', () => {
    expect(testModel).toHaveProperty('observers');
    const entries = Object.entries(testModel);

    testModel.addObserver(observer);
    entries.forEach((entry: [string, any]) => {
      if (entry[0] === 'observers') {
        expect(entry[1].has(observer)).toBeTruthy();
      }
    });

    testModel.removeObserver(observer);
    entries.forEach((entry: [string, any]) => {
      if (entry[0] === 'observers') {
        expect(entry[1].has(observer)).toBeFalsy();
      }
    });
  })

  test('if the lowerValue changes, the model should notyfy observers', () => {
    testModel.addObserver(observer);
    testModel.addObserver(anotherObserver);

    for (let i = 1; i < 8; i++) {
      testModel.setValue(i)
    }

    expect(updateFn).toHaveBeenCalledTimes(7);
    expect(anotherUpdateFn).toHaveBeenCalledTimes(7);
  })

  test('if the lowerValue does not changes, the model should not notify observers', () => {
    testModel.addObserver(observer);

    testModel.setValue(5);
    expect(updateFn).not.toHaveBeenCalled();
  })
})