/**
 * @jest-environment jsdom
 */
import SliderPresenter from '../presenter';

describe('Presenter', () => {
  document.body.innerHTML = `<div id='container'></div>`;
  const testNode = document.getElementById('container');

  const testModelState: Model.Options = {
    minValue: 0,
    maxValue: 100,
    step: 4,
    lowerValue: 20,
    upperValue: null
  };

  const mockGetState = jest.fn((): Model.Options => {
    return testModelState;
  }),
    mockUpdateState = jest.fn(),
    mockAddObserver = jest.fn(),
    mockRemoveObserver = jest.fn(),
    mockSetValue = jest.fn();

  const mockRender = jest.fn(),
    mockUpdate = jest.fn(),
    mockViewAddObserver = jest.fn(),
    mockViewRemoveObserver = jest.fn();
 
  const MockModel = jest.fn<Model, []>( () => {
    return {
      getState: mockGetState,
      updateState: mockUpdateState,
      addObserver: mockAddObserver,
      removeObserver: mockRemoveObserver,
      setValue: mockSetValue,
    }
  });

  const MockView = jest.fn<View, []>( (): View => {
    return {
      render: mockRender,
      update: mockUpdate,
      addObserver: mockViewAddObserver,
      removeObserver: mockViewRemoveObserver,
    }
  });

  let testPresenter: SliderPresenter,
    testModel: Model,
    testView: View;

  beforeEach( () => {
    testModel = new MockModel();
    testView = new MockView();
    testPresenter = new SliderPresenter(testModel, testView);
  })
  
  afterEach( () => {
    mockAddObserver.mockClear()
    mockViewAddObserver.mockClear()
  })

  test('should have props: model, view, modelObserver, viewObserver', () => {
    expect(testPresenter).toBeInstanceOf(SliderPresenter);

    expect(MockView).toHaveBeenCalledTimes(1);
    expect(testPresenter).toHaveProperty('view', testView);

    expect(MockModel).toHaveBeenCalledTimes(1);
    expect(testPresenter).toHaveProperty('model', testModel);

    expect(testPresenter).toHaveProperty('viewObserver');
    expect(testPresenter).toHaveProperty('modelObserver');
  })

  test('method subscribeModelObserver should calls model method addObserver', () => {
    expect(mockAddObserver).toHaveBeenCalledTimes(1)
  })

  test('method subscribeViewObserver should calls view method addObserver', () => {
    expect(mockViewAddObserver).toHaveBeenCalledTimes(1)
  })

})