import SliderModel from '../model';

describe('model', () => {
  const testOptions: Model.Options = {
    minValue: 0,
    maxValue: 50,
    step: 2,
    lowerValue: 10,
  };
  const testOptionsWithUpperValue: Model.Options = {
    upperValue: 20,
    ...testOptions,
  };
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
    testModel.addObserver(observer);
    testModel.addObserver(anotherObserver);
    testModelWithUpperValue.addObserver(observer);
    testModelWithUpperValue.addObserver(anotherObserver);
  });

  afterEach(() => {
    testModel = null;
    testModelWithUpperValue = null;
  });

  describe('constructor', () => {
    test('should set instance properties', () => {
      expect(testModel).toBeInstanceOf(SliderModel);
      expect(testModel.minValue).toBe(0);
      expect(testModel.maxValue).toBe(50);
      expect(testModel.step).toBe(2);
      expect(testModel.upperValue).toBeUndefined();

      expect(testModelWithUpperValue).toBeInstanceOf(SliderModel);
      expect(testModelWithUpperValue.upperValue).toBe(20);
    });
  });

  describe('getState', () => {
    test('should returns model state object', () => {
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
  });

  describe('lowerValue', () => {
    test('should have getters and setters', () => {
      testModel.lowerValue = 12;
      expect(testModel.lowerValue).toBe(12);

      testModel.lowerValue = 4;
      expect(testModel.lowerValue).toBe(4);
    });

    test('should not be undefined, null or Infinite', () => {
      testModel.lowerValue = undefined;
      expect(testModel.lowerValue).toBe(10);
      testModel.lowerValue = null;
      expect(testModel.lowerValue).toBe(10);
      testModel.lowerValue = Infinity;
      expect(testModel.lowerValue).toBe(10);
    });

    test('should be multiple of the step', () => {
      expect(testModel.lowerValue).toBe(10);
      testModel.lowerValue = 15;
      expect(testModel.lowerValue).toBe(14); 
    });

    test('should not be more than maxValue', () => {
      const { maxValue } = testModel;
      testModel.lowerValue = 300;
      expect(testModel.lowerValue).toBe(maxValue);
    });

    test('should not be less than minValue', () => {
      const { minValue } = testModel;
      testModel.lowerValue = -200;
      expect(testModel.lowerValue).toBe(minValue);
    });

    test('should be less or equal then upperValue', () => {
      testModelWithUpperValue.upperValue = 14;
      testModelWithUpperValue.lowerValue = 14;
      expect(testModelWithUpperValue.lowerValue).toBe(14);
      expect(testModelWithUpperValue.upperValue).toBe(14);

      testModelWithUpperValue.lowerValue = 18;
      expect(testModelWithUpperValue.lowerValue).toBe(14);
    });

    test('should notify of changes', () => {
      expect(testModel.lowerValue).toBe(10);
      testModel.lowerValue = 13;
      expect(testModel.lowerValue).toBe(12);
      testModel.lowerValue = 7;
      expect(testModel.lowerValue).toBe(6);

      expect(updateFn).toHaveBeenCalledTimes(2);
      expect(anotherUpdateFn).toHaveBeenCalledTimes(2);
    });

    test('should not notify if lowerValue has not changed', () => {
      expect(testModel.lowerValue).toBe(10);
      expect(testModel.step).toBe(2);
      testModel.lowerValue = 10;
      testModel.lowerValue = 11;
      testModel.lowerValue = 9.5;
      expect(updateFn).not.toBeCalled();
      expect(anotherUpdateFn).not.toBeCalled();
    });
  });

  describe('upperValue', () => {
    test('should have getters and setters', () => {
      testModelWithUpperValue.upperValue = 14;
      expect(testModelWithUpperValue.upperValue).toBe(14);
  
      testModelWithUpperValue.upperValue = 32;
      expect(testModelWithUpperValue.upperValue).toBe(32);
  
      testModelWithUpperValue.upperValue = 26;
      expect(testModelWithUpperValue.upperValue).toBe(26);
    });

    test('should not be undefined, null or Infinite', () => {
      testModelWithUpperValue.upperValue = undefined;
      expect(testModelWithUpperValue.upperValue).toBe(20);
      testModelWithUpperValue.upperValue = null;
      expect(testModelWithUpperValue.upperValue).toBe(20);
      testModelWithUpperValue.upperValue = Infinity;
      expect(testModelWithUpperValue.upperValue).toBe(20);
    });

    test('should be multiple of the step', () => {
      testModelWithUpperValue.upperValue = 15;
      expect(testModelWithUpperValue.upperValue).toBe(14); 
    });

    test('should not be more than maxValue', () => {
      const { maxValue } = testModel;
      testModelWithUpperValue.upperValue = 800;
      expect(testModelWithUpperValue.upperValue).toBe(maxValue);
    });

    test('should not be less than minValue', () => {
      const { minValue } = testModel;
      testModelWithUpperValue.lowerValue = -900;
      testModelWithUpperValue.upperValue = -600;
      expect(testModelWithUpperValue.upperValue).toBe(minValue);
    });

    test('should be greater or equal then lowerValue', () => {
      testModelWithUpperValue.upperValue = 14;
      testModelWithUpperValue.lowerValue = 14;

      testModelWithUpperValue.upperValue = 8;
      expect(testModelWithUpperValue.upperValue).toBe(14);

      testModelWithUpperValue.upperValue = 0;
      expect(testModelWithUpperValue.upperValue).toBe(14);
    });

    test('should notify of changes', () => {
      expect(testModelWithUpperValue.upperValue).toBe(20);
      testModelWithUpperValue.upperValue = 16;
      expect(testModelWithUpperValue.upperValue).toBe(16);
      testModelWithUpperValue.upperValue = 25;
      expect(testModelWithUpperValue.upperValue).toBe(24);

      expect(updateFn).toHaveBeenCalledTimes(2);
      expect(anotherUpdateFn).toHaveBeenCalledTimes(2);
    });

    test('should not notify if upperValue has not changed', () => {
      expect(testModelWithUpperValue.upperValue).toBe(20);
      expect(testModel.step).toBe(2);
      testModelWithUpperValue.upperValue = 20;
      testModelWithUpperValue.upperValue = 21;
      expect(testModelWithUpperValue.upperValue).toBe(20);
      testModelWithUpperValue.upperValue = 19.4;
      expect(testModelWithUpperValue.upperValue).toBe(20);

      expect(updateFn).not.toBeCalled();
      expect(anotherUpdateFn).not.toBeCalled();
    });

  });

  describe('MinValue', () => {
    test('should have getters and setters', () => {
      testModel.minValue = 5;
      expect(testModel.minValue).toBe(5);
    });

    test('should not be undefined, null or Infinity', () => {
      testModel.minValue = 10;
      testModel.minValue = undefined;
      expect(testModel.minValue).toBe(10);
      testModel.minValue = null;
      expect(testModel.minValue).toBe(10);
      testModel.minValue = 10 / 0;
      expect(testModel.minValue).toBe(10);
    });

    test('should not changed, if value greater then this.maxValue', () => {
      testModel.minValue = 300;
      expect(testModel.minValue).toBe(0);
    });

    test('should changed lowerValue and upperValue, if necessary', () => {
      testModel.lowerValue = 5;
      testModel.minValue = 15;
      expect(testModel.lowerValue).toBe(15);
      
      testModelWithUpperValue.upperValue = 14;
      testModelWithUpperValue.minValue = 16;
      expect(testModelWithUpperValue.upperValue).toBe(16);
      expect(testModelWithUpperValue.lowerValue).toBe(16);
    });

    test('should notify of changes', () => {
      expect(testModel.minValue).toBe(0);
      testModel.minValue = -15;
      expect(testModel.minValue).toBe(-15);
      testModel.minValue = 10;
      expect(testModel.minValue).toBe(10);

      expect(updateFn).toHaveBeenCalledTimes(2);
      expect(anotherUpdateFn).toHaveBeenCalledTimes(2);
    });

    test('should not notify, if minValue has not changed', () => {
      expect(testModel.maxValue).toBe(50);
      expect(testModel.minValue).toBe(0);
      testModel.minValue = 0;
      testModel.minValue = 60;

      expect(updateFn).not.toBeCalled();
      expect(anotherUpdateFn).not.toBeCalled();
    });
  });

  describe('MaxValue', () => {
    test('should have getters and setters', () => {
      testModel.maxValue = 70;
      expect(testModel.maxValue).toBe(70);
    });

    test('should not be undefined, null or Infinity', () => {
      testModel.maxValue = 80;
      testModel.maxValue = undefined;
      expect(testModel.maxValue).toBe(80);
      testModel.maxValue = null;
      expect(testModel.maxValue).toBe(80);
      testModel.maxValue = 10 / 0;
      expect(testModel.maxValue).toBe(80);
    });

    test('should not changed, if value less then this.minValue', () => {
      testModel.maxValue = -300;
      expect(testModel.maxValue).toBe(50);
    });

    test('should changed lowerValue and upperValue, if necessary', () => {
      testModel.lowerValue = 33;
      testModel.maxValue = 30;
      expect(testModel.lowerValue).toBe(30);
      
      testModelWithUpperValue.upperValue = 40;
      testModelWithUpperValue.maxValue = 30;
      expect(testModelWithUpperValue.upperValue).toBe(30);
    });

    test('should notify of changes', () => {
      expect(testModel.maxValue).toBe(50);
      testModel.maxValue = 100;
      expect(testModel.maxValue).toBe(100);
      testModel.maxValue = 150;
      expect(testModel.maxValue).toBe(150);

      expect(updateFn).toHaveBeenCalledTimes(2);
      expect(anotherUpdateFn).toHaveBeenCalledTimes(2);
    });

    test('should not notify, if minValue has not changed', () => {
      expect(testModel.maxValue).toBe(50);
      expect(testModel.minValue).toBe(0);
      testModel.maxValue = 0;
      testModel.maxValue = -50;

      expect(updateFn).not.toBeCalled();
      expect(anotherUpdateFn).not.toBeCalled();
    });
  });

  describe('step', () => {
    test('should have getters and setters', () => {
      testModel.step = 5;
      expect(testModel.step).toBe(5);
    });

    test('should not be undefined, null or Infinity', () => {
      testModel.step = 3;
      testModel.step = undefined;
      expect(testModel.step).toBe(3);
      testModel.step = null;
      expect(testModel.step).toBe(3);
      testModel.step = 5 + Infinity;
      expect(testModel.step).toBe(3);
      testModel.step = NaN;
      expect(testModel.step).toBe(3);
    });

    test('should be greater that 0', () => {
      testModel.step = -2;
      expect(testModel.step).toBe(2);
      testModel.step = 0;
      expect(testModel.step).toBe(2);
    });

    test('should change lowerValue and upperValue, if necessary', () => {
      testModel.step = 12;
      expect(testModel.lowerValue).toBe(12);
      testModel.step = 25;
      expect(testModel.lowerValue).toBe(0);
  
      testModelWithUpperValue.step = 8;
      expect(testModelWithUpperValue.upperValue).toBe(16);
      testModelWithUpperValue.step = 11;
      expect(testModelWithUpperValue.upperValue).toBe(11);
    });

    test('should notify of changes', () => {
      expect(testModel.step).toBe(2);
      testModel.step = 4;
      expect(testModel.step).toBe(4);
      testModel.step = 1;
      expect(testModel.step).toBe(1);

      expect(updateFn).toHaveBeenCalledTimes(2);
      expect(anotherUpdateFn).toHaveBeenCalledTimes(2);
    });

    test('should not notify, if step has not changed', () => {
      expect(testModel.step).toBe(2);
      testModel.step = 2;

      expect(updateFn).not.toBeCalled();
      expect(anotherUpdateFn).not.toBeCalled();
    });
  });

  describe('addObserver', () => {
    test('should added observer to this.observers', () => {
      expect(testModel).toHaveProperty('observers');
      testModel.addObserver(observer);

      const entries = Object.entries(testModel);
      
      entries.forEach((entry) => {
        if (entry[0] === 'observers') {
          expect(entry[1].has(observer)).toBeTruthy();
        }
      });
    });
  });

  describe('removeObserver', () => {
    test('should removed observer', () => {
      expect(testModel).toHaveProperty('observers');
      const entries = Object.entries(testModel);
  
      testModel.addObserver(observer);
      entries.forEach((entry) => {
        if (entry[0] === 'observers') {
          expect(entry[1].has(observer)).toBeTruthy();
        }
      });
  
      testModel.removeObserver(observer);
      entries.forEach((entry) => {
        if (entry[0] === 'observers') {
          expect(entry[1].has(observer)).toBeFalsy();
        }
      });
    });
  });

  describe('updateState', () => {
    test('should update instance properties', () => {
      const newState: Model.Options = {
        minValue: -45,
        maxValue: 145,
        step: 15,
        lowerValue: 30,
      };
      const newMinValue: Model.Options = {
        minValue: -145,
      };
  
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
  
      expect(testModel.upperValue).toBeUndefined();
      testModel.updateState({ upperValue: 30 });
      expect(testModel.upperValue).toBe(30);
    });
    
    test('should notify of changes only once', () => {
      testModel.addObserver(observer);
      testModel.addObserver(anotherObserver);
  
      testModel.updateState({
        minValue: -20,
        maxValue: 20,
        step: 4,
        lowerValue: 8,
      });
  
      expect(updateFn).toHaveBeenCalledTimes(1);
      expect(anotherUpdateFn).toHaveBeenCalledTimes(1);
  
      testModel.updateState({ upperValue: 30 });
  
      expect(updateFn).toHaveBeenCalledTimes(2);
      expect(anotherUpdateFn).toHaveBeenCalledTimes(2);
    });
  });
});
