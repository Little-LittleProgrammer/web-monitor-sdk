import { console_error } from './console-error';
import { js_error } from './js-error';
import { promise_error } from './promise-error';
import { resource_error } from './resource-error';
import { vue_error } from './vue-error';
/**
 * 上传的
 *  {
 *      type: 'error', // 数据类型
 *      subType: 'js-error', // 副类型
 *      pageURL: source, // 页面
 *      startTime: performance.now(), // 出现时间
 *      extraData: { // 额外数据
 *      }
 * }
 */

// 错误集合
export function error() {
    console_error();
    js_error();
    promise_error();
    resource_error();
    vue_error();
}
