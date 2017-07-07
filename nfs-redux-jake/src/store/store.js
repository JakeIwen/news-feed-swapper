import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import socketMiddleware from './socketMiddleware';

import {reducers} from './reducers.js';

export function configureStore(initialState = {}) {
  const store = createStore(
    reducers,
    initialState,
    applyMiddleware(thunk, socketMiddleware)
  );
  return store;
};

export const store = configureStore();
