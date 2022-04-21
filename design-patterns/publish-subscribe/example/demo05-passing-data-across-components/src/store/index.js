// example/demo05-passing-data-across-components/src/store/index.js
import configStore from './config-store';
import reducer from './reducer';

export const { store, createAction } = configStore(reducer);

export default store;