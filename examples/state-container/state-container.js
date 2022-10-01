const ACTION_DISPATCHED = 'action-dispatched';

const identity = (x) => x;

export const createStore = ({
  actionsTable = {},
  initialState = {},
  middleware = [],
}) => {
  let _state = initialState;
  const getState = () => structuredClone(_state);

  const eventTarget = new EventTarget();

  const baseDispatchAsMiddleware = () => {
    const baseDispatch = createStateLoop({ initialState, actionsTable });
    return (action) => {
      _state = baseDispatch(action);
      eventTarget.dispatchEvent(new CustomEvent(ACTION_DISPATCHED));
    };
  };
  const dispatchStack = [
    ...middleware.map((fn) => fn({ getState })),
    baseDispatchAsMiddleware,
  ];
  const dispatch = createDispatch(dispatchStack);

  return {
    dispatch,
    getState,
    ...createSubscribable(eventTarget),
  };
};

function createSubscribable(eventTarget) {
  const unsubscribe = (listener) =>
    eventTarget.removeEventListener(ACTION_DISPATCHED, listener);
  const subscribe = (listener) => {
    eventTarget.addEventListener(ACTION_DISPATCHED, listener);
    return () => unsubscribe(listener);
  };
  return {
    subscribe,
    unsubscribe,
  };
}

function createDispatch(stack = []) {
  const [current, ...rest] = stack;
  return !rest.length ? current() : current(createDispatch(rest));
}

export function* stateLoop({ actionsTable, state }) {
  while (true) {
    const action = yield state;
    const handler = actionsTable[action.type] ?? identity;
    state = handler(state, action);
  }
}

function createStateLoop({ initialState, actionsTable }) {
  const iterator = stateLoop({ actionsTable, state: initialState });
  iterator.next();
  return (action) => iterator.next(action).value;
}
