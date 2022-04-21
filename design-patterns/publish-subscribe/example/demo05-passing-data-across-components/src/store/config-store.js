// @ts-nocheck
// example/demo05-passing-data-across-components/src/store/config-store.js
import { createStore, applyMiddleware, compose } from 'redux';
import { createAction as reduxCreateAction } from 'redux-actions'

export default (reducer, middlewares = []) => {
  const composeEnhancers = (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
  
  const enhancer = composeEnhancers(applyMiddleware(...middlewares));
  const store = createStore(reducer, enhancer)
  const createAction = actionType => (...args) => store.dispatch(reduxCreateAction(actionType)(...args))
  
  return { store, createAction };
}