import { post } from './request';
import { get_unique_id, get_uuid, get_network_info } from '../utils/tools/index';
import { config } from '../config';
import { add_cache, get_cache, clear_cache } from '../utils/cache';

export async function report(data, isImmediate = false) {
    const _reportData = {
        id: get_unique_id(16),
        appID: config.appID,
        userID: config.userID || get_uuid(),
        appName: config.appName,
        data
    };
    const _networkInfo = get_network_info();
    if (_networkInfo) {
        _reportData.networkInfo = {
            ..._networkInfo
        };
    }
    if (isImmediate) {
        await post(_reportData);
        return;
    }
    if (window.requestIdleCallback) { // 不阻止进程
        window.requestIdleCallback(async () => {
            await post(_reportData);
        }, { timeout: 3000 });
    } else {
        setTimeout(async () => {
            await post(_reportData);
        });
    }
}

let timer = null;
// 当缓存数据达到一定数量后, 进行上报
// 万一数据没达到上报数量，再页面关闭前unbeforeunload进行剩余数据上报
export function lazy_report_cache(data, timeout = 3000) {
    add_cache(data);
    clearTimeout(timer);
    timer = setTimeout(() => {
        const _data = get_cache();
        if (_data.length >= config.cacheNum) {
            report(_data);
            clear_cache();
        }
    }, timeout);
}
