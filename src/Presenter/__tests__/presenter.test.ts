/**
 * @jest-environment jsdom
 */
import SliderPresenter from '../presenter';

describe('Presenter', () => {
  document.body.innerHTML = "<div id='container'></div>";
  // const testNode = document.getElementById('container');

  const testModelState: Model.Options = {
    minValue: 0,
    maxValue: 100,
    step: 4,
    lowerValue: 20,
    upperValue: 40,
  };

  const testViewOptions: View.Options = {
    orientation: 'horizontal',
    range: true,
    bar: true,
    scale: false,
    tooltip: false,
  };

  const testDataValues: Array<number | string> = ['one', 'two', 'three', 'four', 'five', 'six'];

  const mockOnChange = jest.fn(),
    mockOnUpdate = jest.fn();

  const modelObservers = new Set<Model.Observer>();
  const viewObservers = new Set<View.Observer>();
  const mockModelNotify = jest.fn(() => {
    modelObservers.forEach((observer: Model.Observer) => {
      observer.update();
    });
  });

  const mockGetState = jest.fn((): Model.Options => testModelState),
    mockUpdateState = jest.fn(() => {
      mockModelNotify();
    }),
    mockAddObserver = jest.fn((observer: Model.Observer) => {
      modelObservers.add(observer);
    }),
    mockRemoveObserver = jest.fn((observer: Model.Observer) => {
      modelObservers.delete(observer);
    }),
    mockSetLowerValue = jest.fn(),
    mockSetUpperValue = jest.fn();

  const mockRender = jest.fn(),
    mockUpdate = jest.fn(),
    mockViewAddObserver = jest.fn((observer: Model.Observer) => {
      viewObservers.add(observer);
    }),
    mockViewRemoveObserver = jest.fn((observer: Model.Observer) => {
      viewObservers.delete(observer);
    }),
    mockGetViewData = jest.fn((): View.Options => testViewOptions);

  const MockModel = jest.fn<Model, []>(() => {
    return {
      minValue: 0,
      maxValue: 100,
      step: 4,
      lowerValue: 20,
      upperValue: null,
      getState: mockGetState,
      updateState: mockUpdateState,
      addObserver: mockAddObserver,
      removeObserver: mockRemoveObserver,
      setlowerValue: mockSetLowerValue,
      setUpperValue: mockSetUpperValue,
      notify: (): void => {
        modelObservers.forEach((observer: Model.Observer) => {
          observer.update();
        });
      },
    };
  });

  const MockView = jest.fn<View, []>((): View => {
    return {
      render: mockRender,
      update: mockUpdate,
      addObserver: mockViewAddObserver,
      removeObserver: mockViewRemoveObserver,
      getData: mockGetViewData,
    };
  });

  let testPresenter: SliderPresenter, testModel: Model, testView: View;

  beforeEach(() => {
    testModel = new MockModel();
    testView = new MockView();
    testPresenter = new SliderPresenter({
      model: testModel,
      view: testView,
      onChange: mockOnChange,
      onUpdate: mockOnUpdate,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    modelObservers.clear();
    viewObservers.clear();
  });

  describe('constructor', () => {
    test('should have props: model, view, modelObserver, viewObserver, dataValues, renderData', () => {
      expect(testPresenter).toBeInstanceOf(SliderPresenter);
      expect(MockView).toHaveBeenCalledTimes(1);
      expect(testPresenter).toHaveProperty('view', testView);
      expect(MockModel).toHaveBeenCalledTimes(1);
      expect(testPresenter).toHaveProperty('model', testModel);
      expect(testPresenter).toHaveProperty('viewObserver');
      expect(testPresenter).toHaveProperty('modelObserver');
      expect(testPresenter).toHaveProperty('dataValues');
      expect(testPresenter).toHaveProperty('renderData');
    });

    test('should calls model method addObserver', () => {
      expect(mockAddObserver).toHaveBeenCalledTimes(1);
      expect(modelObservers.size).toBe(1);
    });

    test('should calls view method addObserver', () => {
      expect(mockViewAddObserver).toHaveBeenCalledTimes(1);
      expect(viewObservers.size).toBe(1);
    });

    test('should calls render method of view', () => {
      expect(mockRender).toBeCalledTimes(1);
    });
  });

  describe('getModelData', () => {
    beforeEach(() => {
      mockGetState.mockClear();
      testPresenter.getModelData();
    });

    test('should calls model method getState', () => {
      expect(mockGetState).toBeCalledTimes(1);
    });

    test('should returns model state', () => {
      expect(mockGetState).toHaveReturnedWith({
        minValue: 0,
        maxValue: 100,
        step: 4,
        lowerValue: 20,
        upperValue: 40,
      });
    });
  });

  describe('getViewData', () => {
    beforeEach(() => {
      testPresenter.getViewData();
    });

    test('should calls view method getData', () => {
      expect(mockGetViewData).toHaveBeenCalledTimes(1);
    });

    test('should returns view data', () => {
      expect(mockGetViewData).toHaveReturnedWith({
        orientation: 'horizontal',
        range: true,
        bar: true,
        scale: false,
        tooltip: false,
      });
    });
  });

  describe('getPresenterData', () => {
    test('should return presenter data: dataValues, renderData', () => {
      const dataValues = testPresenter.getPresenterData();
      expect(dataValues).toEqual({
        dataValues: [],
        renderData: [
          0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68,
          72, 76, 80, 84, 88, 92, 96, 100,
        ],
      });
    });
  });

  describe('getAllData', () => {
    test('should returns data: model, view, presenter', () => {
      const allData = testPresenter.getAllData();
      expect(allData).toEqual({
        minValue: 0,
        maxValue: 100,
        step: 4,
        lowerValue: 20,
        upperValue: 40,
        orientation: 'horizontal',
        range: true,
        bar: true,
        scale: false,
        tooltip: false,
        dataValues: [],
        renderData: [
          0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68,
          72, 76, 80, 84, 88, 92, 96, 100,
        ],
      });
    });
  });

  describe('dataValues', () => {
    beforeEach(() => {
      mockUpdateState.mockClear();
      mockRender.mockClear();
    });

    test('should changes values, if dataValues.length > 0', () => {
      testPresenter.update({ dataValues: testDataValues });

      expect(mockUpdateState).toBeCalledWith({
        minValue: 0,
        maxValue: 5,
        step: 1,
      });

      testPresenter.update({ dataValues: [45, 46, 77, 33, 88, 88, 49, 11, 6] });

      expect(mockUpdateState).toBeCalledWith({
        minValue: 0,
        maxValue: 8,
        step: 1,
      });
    });

    test('should not changes values, if dataValues <= 0', () => {
      testPresenter.update({ dataValues: [] });

      expect(mockUpdateState).not.toBeCalled();
    });

    test('should render view, after updating dataValues', () => {
      testPresenter.update({ dataValues: testDataValues });
      expect(mockRender).toBeCalled();
    });
  });

  describe('model observer', () => {
    beforeEach(() => {
      mockGetState.mockClear();
      testModel.updateState({ lowerValue: 6 });
    });

    test('observer should request updated model data', () => {
      expect(mockModelNotify).toHaveBeenCalledTimes(1);
      expect(mockGetState).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      mockOnUpdate.mockClear();
    });

    test('should calls model method updateState, it if is necessary to update the model state', () => {
      testPresenter.update({
        minValue: 12,
        maxValue: 48,
        step: 4,
        lowerValue: 16,
        upperValue: 32,
      });

      expect(mockUpdateState).toBeCalledWith({
        minValue: 12,
        maxValue: 48,
        step: 4,
        lowerValue: 16,
        upperValue: 32,
      });

      testPresenter.update({ lowerValue: 20 });

      expect(mockUpdateState).toBeCalledWith({ lowerValue: 20 });
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    test('should calls view method update, it if is necessary to update the view props', () => {
      testPresenter.update({
        orientation: 'vertical',
        range: true,
        bar: false,
        scale: true,
        tooltip: true,
      });

      expect(mockUpdate).toBeCalledWith({
        orientation: 'vertical',
        range: true,
        bar: false,
        scale: true,
        tooltip: true,
      });

      testPresenter.update({ scale: true });

      expect(mockUpdate).toBeCalledWith({ scale: true });
      expect(mockUpdateState).not.toBeCalled();
    });

    test('should updates dataValues and renderData', () => {
      testPresenter.update({ dataValues: testDataValues });

      expect(testPresenter).toHaveProperty('dataValues', ['one', 'two', 'three', 'four', 'five', 'six']);
      expect(testPresenter).toHaveProperty('renderData', ['one', 'two', 'three', 'four', 'five', 'six']);
    });

    test('should calls onUpdate', () => {
      testPresenter.update({
        minValue: 30,
        maxValue: 120,
      });

      expect(mockOnUpdate).toBeCalledTimes(1);
    });
  });
});
