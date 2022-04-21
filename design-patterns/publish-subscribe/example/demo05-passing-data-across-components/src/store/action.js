// example/demo05-passing-data-across-components/src/store/action.js
import { createAction } from './index';
import { XIA_SHENG_ZHI, SHANG_ZHOU_ZE } from './type';

/**
 * 上奏折
 */
export const reduxShangZhouZe = createAction(SHANG_ZHOU_ZE);
/**
 * 下圣旨
 */
export const reduxXiaShengZhi = createAction(XIA_SHENG_ZHI);