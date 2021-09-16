import SliderModel from "../model";

describe("model", () => {
  const testOptions: Model.Options = {
    minValue: 0,
    maxValue: 50,
    step: 2,
    lowerValue: 10,
  };
  const testOptionsWithUpperValue: Model.Options = {
    upperValue: 20,
    ...testOptions,
  }
  let testModel: SliderModel,
    testModelWithUpperValue: SliderModel,
    observer: Model.Observer,
    anotherObserver: Model.Observer,
    updateFn: jest.Mock,
    anotherUpdateFn: jest.Mock;

  beforeEach(() => {
    testModel = new SliderModel(testOptions);
    testModelWithUpperValue = new SliderModel(testOptionsWithUpperValue);
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
    testModelWithUpperValue = null;
  });

  test('constructor should set instance properties', () => {
    expect(testModel).toBeInstanceOf(SliderModel);
    expect(testModel.minValue).toBe(0);
    expect(testModel.maxValue).toBe(50);
    expect(testModel.step).toBe(2);
    expect(testModel.upperValue).toBeUndefined();

    expect(testModelWithUpperValue).toBeInstanceOf(SliderModel);
    expect(testModelWithUpperValue.upperValue).toBe(20);
  });

  test('getState should returns model state object', () => {
    expect(testModel.getState()).toBeInstanceOf(Object);

    const state = testModel.getState();

    expect(state).toHaveProperty('minValue', 0);
    expect(state).toHaveProperty('maxValue', 50);
    expect(state).toHaveProperty('step', 2);
    expect(state).toHaveProperty('lowerValue', 10);
    expect(state.upperValue).toBeUndefined();

    const stateWithUpperValue = testModelWithUpperValue.getState();

    expect(stateWithUpperValue).toHaveProperty('upperValue', 20);
  });

  test('should set the lowerValue', () => {
    testModel.lowerValue = 12;
    expect(testModel.lowerValue).toBe(12);

    testModel.lowerValue = 4;
    expect(testModel.lowerValue).toBe(4);
  });

  test('should set the upperValue', () => {
    testModelWithUpperValue.upperValue = 14;
    expect(testModelWithUpperValue.upperValue).toBe(14);

    testModelWithUpperValue.upperValue = 32;
    expect(testModelWithUpperValue.upperValue).toBe(32);

    testModelWithUpperValue.upperValue = 26;
    expect(testModelWithUpperValue.upperValue).toBe(26);
  });

  test('set minValue should change this.minValue', () => {
    testModel.minValue = 20;
    expect(testModel.minValue).toBe(20);
  });

  test('set minValue should not change this.minValue, if value greater then this.maxValue', () => {
    testModel.minValue = 100;
    expect(testModel.minValue).toBe(0);
  })

  test('set maxValue should change this._maxValue', () => {
    testModel.maxValue = 200;
    expect(testModel.maxValue).toBe(200);
  });

  test('set maxValue should not change this._maxValue, if value less then this._minValue', () => {
    testModel.maxValue = -20;
    expect(testModel.maxValue).toBe(50);
  })

  test('set lowerValue and upperValue should be a multiple of step', () => {
    expect(testModel.lowerValue).toBe(10);
    testModel.lowerValue = 13;
    expect(testModel.lowerValue).toBe(12);

    testModelWithUpperValue.upperValue = 21;
    expect(testModelWithUpperValue.upperValue).toBe(20);
  });

  test('set step should change this.step', () => {
    testModel.step = 5;
    expect(testModel).toHaveProperty('_step', 5);
    expect(testModel.step).toBe(5);
  });

  test('step must be greater than 0', () => {
    testModel.step = -2;
    expect(testModel.step).toBe(2);
  })

  test('if the argument of the set lowerValue and upperValue is greater than the maxValue, then value should equal maxValue', () => {
    const maxValue = testModel.maxValue;
    testModel.lowerValue = 99;
    expect(testModel.lowerValue).toEqual(maxValue);

    testModelWithUpperValue.upperValue = 300;
    expect(testModelWithUpperValue.upperValue).toEqual(maxValue);
  });

  test('if the argument of the set lowerValue and upperValue is less than the minValue, then value should equal minValue', () => {
    const minValue = testModel.minValue;
    testModel.lowerValue = -33;
    expect(testModel.lowerValue).toEqual(minValue);

    testModelWithUpperValue.upperValue = -144;
    expect(testModelWithUpperValue.upperValue).toEqual(minValue);
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

  test('if the state changes, the model should notify observers', () => {
    testModel.addObserver(observer);
    testModel.addObserver(anotherObserver);

    testModel.lowerValue = 20;
    testModel.minValue = -10;
    testModel.maxValue = 80;
    testModel.step = 5;
    
    expect(updateFn).toHaveBeenCalledTimes(4);
    expect(anotherUpdateFn).toHaveBeenCalledTimes(4);

    testModel.minValue = -20;

    expect(updateFn).toHaveBeenCalledTimes(5);
    expect(anotherUpdateFn).toHaveBeenCalledTimes(5);
  });

  test('if the lowerValue does not changes, the model should not notify observers', () => {
    testModel.addObserver(observer);

    testModel.lowerValue = 10;
    expect(updateFn).not.toHaveBeenCalled();

    testModel.lowerValue = testModel.getState().lowerValue;
    expect(updateFn).not.toHaveBeenCalled();
  });

  test('changing max or min limit should changed lowerValue and upperValue', () => {
    testModel.lowerValue = 25;
    testModel.maxValue = 20;
    expect(testModel.lowerValue).toBe(20);

    testModel.lowerValue = 8;
    testModel.minValue = 10;
    expect(testModel.lowerValue).toBe(10);

    testModelWithUpperValue.maxValue = 35;
    testModelWithUpperValue.upperValue = 38;
    expect(testModelWithUpperValue.upperValue).toBe(35);

    testModelWithUpperValue.upperValue = 0;
    testModelWithUpperValue.minValue = 10;
    expect(testModelWithUpperValue.upperValue).toBe(10);
    expect(testModel.lowerValue).toBe(10);
  })

  test('updateState should take object Model.Options and update instance properties', () => {
    const newState: Model.Options = {
      minValue: -45,
      maxValue: 145,
      step: 15,
      lowerValue: 30,
      // upperValue: null,
    };
    const newMinValue: Model.Options = {
      minValue: -145
    }

    testModel.updateState(newState);
    
    expect(testModel).toHaveProperty('_minValue', -45);
    expect(testModel).toHaveProperty('_maxValue', 145);
    expect(testModel).toHaveProperty('_step', 15);
    expect(testModel).toHaveProperty('_lowerValue', 30);

    testModel.updateState(newMinValue);
    expect(testModel.minValue).toBe(-145);

    testModel.updateState({ lowerValue: 48 });
    expect(testModel.lowerValue).toBe(45);

    testModel.updateState({ maxValue: 300, step: 0, lowerValue: -75 });
    expect(testModel.lowerValue).toBe(-75);
    expect(testModel.step).toBe(15);
    expect(testModel.maxValue).toBe(300);
  })

  test('after updating the model with the updateState(), the notify() should be called only once', () => {
    testModel.addObserver(observer);
    testModel.addObserver(anotherObserver);

    testModel.updateState({
      minValue: -20,
      maxValue: 20,
      step: 4,
      lowerValue: 8,
    })

    expect(updateFn).toHaveBeenCalledTimes(1);
    expect(anotherUpdateFn).toHaveBeenCalledTimes(1);
  })
});
