// example/demo05-passing-data-across-components/src/store/reducer.js
// @ts-nocheck
import { handleActions } from 'redux-actions';
import { SHANG_ZHOU_ZE, XIA_SHENG_ZHI } from './type';

const initialState = {
  zhouze: '',
  shengzhi: ''
};

export default handleActions({
  [SHANG_ZHOU_ZE]: (state, { payload }) => ({ ...state, zhouze: payload }),
  [XIA_SHENG_ZHI]: (state, { payload }) => ({ ...state, shengzhi: payload })
}, initialState);