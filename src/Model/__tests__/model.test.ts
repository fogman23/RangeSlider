import Model from '../model';
import { Options } from '../model';

describe('model', () => {
  let testModel: Model;
  const testOptions: Options = {
    minValue: 0,
    maxValue: 50,
    step: 2,
    lowerValue: 5,
    upperValue: null,
  }

  beforeEach( () => {
    testModel = new Model(testOptions);
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
})