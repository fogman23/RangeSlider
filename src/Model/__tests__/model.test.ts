import SliderModel from "../model";

describe("model", () => {
  const testOptions: Model.Options = {
    minValue: 0,
    maxValue: 50,
    step: 2,
    lowerValue: 10,
    upperValue: null,
  };
  let testModel: SliderModel,
    updateFn: jest.Mock,
    anotherUpdateFn: jest.Mock,
    observer: Model.Observer,
    anotherObserver: Model.Observer;

  beforeEach(() => {
    testModel = new SliderModel(testOptions);
    updateFn = jest.fn();
    anotherUpdateFn = jest.fn();
    observer = {
      update: updateFn,
    };
    anotherObserver = {
      update: anotherUpdateFn,
    };
  });

  afterEach(() => {
    testModel = null;
  });

  test('constructor should set instance properties', () => {
    expect(testModel).toBeInstanceOf(SliderModel);
    expect(testModel).toHaveProperty('minValue', 0);
    expect(testModel).toHaveProperty('maxValue', 50);
    expect(testModel).toHaveProperty('step', 2);
    expect(testModel).toHaveProperty('lowerValue', 10);
    expect(testModel).toHaveProperty('upperValue', null);
  });

  test('getState should returns model state object', () => {
    expect(testModel.getState()).toBeInstanceOf(Object);

    const state = testModel.getState();

    expect(state).toHaveProperty('minValue', 0);
    expect(state).toHaveProperty('maxValue', 50);
    expect(state).toHaveProperty('step', 2);
    expect(state).toHaveProperty('lowerValue', 10);
    expect(state).toHaveProperty('upperValue', null);
  });

  test('setValue should set the lowerValue', () => {
    testModel.setValue(12);
    expect(testModel.getState().lowerValue).toBe(12);

    testModel.setValue(4);
    expect(testModel.getState().lowerValue).toBe(4);
  });

  test('setMinValue should change this.minValue', () => {
    testModel.setMinValue(20);
    expect(testModel).toHaveProperty('minValue', 20);
  });

  test('setMinValue should not change this.minValue, if value greater then this.maxValue', () => {
    testModel.setMinValue(100);
    expect(testModel).toHaveProperty('minValue', 0);
  })

  test('setMaxValue should change this.maxValue', () => {
    testModel.setMaxValue(200);
    expect(testModel).toHaveProperty('maxValue', 200);
  });

  test('setMaxValue should not change this.maxValue, if value less then this.minValue', () => {
    testModel.setMaxValue(-20);
    expect(testModel).toHaveProperty('maxValue', 50);
  })

  test('the set value should be a multiple of step', () => {
    expect(testModel).toHaveProperty('lowerValue', 10);
    testModel.setValue(13);
    expect(testModel.getState().lowerValue).toBe(12);
  });

  test('if the argument of the setValue fn is greater than the maxValue, then value should equal maxValue', () => {
    const maxValue = testModel.getState().maxValue;
    testModel.setValue(99);
    expect(testModel.getState().lowerValue).toEqual(maxValue);
  });

  test('if the argument of the setValue fn is less than the minValue, then value should equal minValue', () => {
    const minValue = testModel.getState().minValue;
    testModel.setValue(-33);
    expect(testModel.getState().lowerValue).toEqual(minValue);
  });

  test('addObserver should added observer to this.observers', () => {
    expect(testModel).toHaveProperty('observers');
    testModel.addObserver(observer);

    const entries = Object.entries(testModel);
    entries.forEach((entry: [string, any]) => {
      if (entry[0] === 'observers') {
        expect(entry[1].has(observer)).toBeTruthy();
      }
    });
  });

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
  });

  test('if the lowerValue changes, the model should notyfy observers', () => {
    testModel.addObserver(observer);
    testModel.addObserver(anotherObserver);

    for (let i = 0; i < 8; i += testOptions.step) {
      testModel.setValue(i);
    }

    expect(updateFn).toHaveBeenCalledTimes(4);
    expect(anotherUpdateFn).toHaveBeenCalledTimes(4);
  });

  test('if the lowerValue does not changes, the model should not notify observers', () => {
    testModel.addObserver(observer);

    testModel.setValue(10);
    expect(updateFn).not.toHaveBeenCalled();

    testModel.setValue(testModel.getState().lowerValue);
    expect(updateFn).not.toHaveBeenCalled();
  });

  test('updateState should take object Model.Options and update instance properties', () => {
    const newState: Model.Options = {
      minValue: -45,
      maxValue: 145,
      step: 15,
      lowerValue: 30,
      upperValue: null,
    };
    const newMinValue: Model.Options = {
      minValue: -145
    }

    testModel.updateState(newState);
    expect(testModel).toHaveProperty('minValue', -45);
    expect(testModel).toHaveProperty('maxValue', 145);
    expect(testModel).toHaveProperty('step', 15);
    expect(testModel).toHaveProperty('lowerValue', 30);
    expect(testModel).toHaveProperty('upperValue', null);

    testModel.updateState(newMinValue);
    expect(testModel).toHaveProperty('minValue', -145);

    testModel.updateState({ lowerValue: 48 });
    expect(testModel).toHaveProperty('lowerValue', 45);
  })
});
