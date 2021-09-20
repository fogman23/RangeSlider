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
    upperValue: null,
  };

  const testViewOptions: View.Options = {
    orientation: 'horizontal',
    range: true,
    bar: true,
    scale: false,
    tooltip: false,
  };

  const mockGetState = jest.fn((): Model.Options => testModelState),
    mockUpdateState = jest.fn(),
    mockAddObserver = jest.fn(),
    mockRemoveObserver = jest.fn(),
    mockSetLowerValue = jest.fn(),
    mockSetUpperValue = jest.fn();

  const mockRender = jest.fn(),
    mockUpdate = jest.fn(),
    mockViewAddObserver = jest.fn(),
    mockViewRemoveObserver = jest.fn(),
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
      onStart: jest.fn(),
      onChange: jest.fn(),
      onFinish: jest.fn(),
      onUpdate: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('should have props: model, view, modelObserver, viewObserver, dataValues', () => {
      expect(testPresenter).toBeInstanceOf(SliderPresenter);

      expect(MockView).toHaveBeenCalledTimes(1);
      expect(testPresenter).toHaveProperty('view', testView);

      expect(MockModel).toHaveBeenCalledTimes(1);
      expect(testPresenter).toHaveProperty('model', testModel);

      expect(testPresenter).toHaveProperty('viewObserver');
      expect(testPresenter).toHaveProperty('modelObserver');

      expect(testPresenter).toHaveProperty('dataValues');
    });

    test('should calls model method addObserver', () => {
      expect(mockAddObserver).toHaveBeenCalledTimes(1);
    });

    test('should calls view method addObserver', () => {
      expect(mockViewAddObserver).toHaveBeenCalledTimes(1);
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
        upperValue: null,
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
    test('should return presenter data: dataValues', () => {
      const dataValues = testPresenter.getPresenterData();
      expect(dataValues).toEqual([
        0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72,
        76, 80, 84, 88, 92, 96, 100,
      ]);
    });
  });
  
});
