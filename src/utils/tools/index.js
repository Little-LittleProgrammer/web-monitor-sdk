export * from './error-tools'
export * from './performance-tools'

export function deep_copy(target) {
    // if (typeof target === 'object') {
    //     const result = Array.isArray(target) ? [] : {};
    //     for (const key in target) {
    //         if (typeof target[key] == 'object') {
    //             result[key] = deep_copy(target[key]);
    //         } else {
    //             result[key] = target[key];
    //         }
    //     }

    //     return result;
    // }

    // return target;
    return JSON.parse(JSON.stringify(target));
}

export function get_unique_id(len, radix) { //  指定长度和基数
    const _chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    const _uuid = [];
    let i;
    radix = radix || _chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) _uuid[i] = _chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        let r;

        // rfc4122 requires these characters
        _uuid[8] = '-';
        _uuid[13] = '-';
        _uuid[18] = '-';
        _uuid[23] = '-';
        _uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!_uuid[i]) {
                r = 0 | Math.random() * 16;
                _uuid[i] = _chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return _uuid.join('');
}

export function get_uuid() { // 用户id
    let _uuid = localStorage.getItem('uuid');
    if (_uuid) return _uuid;

    _uuid = get_unique_id(16);
    localStorage.setItem('uuid', _uuid);
    return _uuid;
}

// 获取页面url
export function get_page_url() {
    const _url = window.location.href.split('?')[0];
    return _url;
}

// 获取浏览器是否支持sendBeacon(同步请求不阻塞浏览器进程)
export function is_support_send_beacon() {
    return !!(window.navigator && window.navigator.sendBeacon);
}

export function get_network_info() {
    if (window.navigator.connection) {
        const _info = window.navigator.connection;
        return {
            effectiveType: _info.effectiveType, // 网络类型
            downlink: _info.downlink, // 下行速度
            rtt: _info.rtt, // 发送数据到接受数据的往返时间
            saveData: _info.saveData // 是否打开数据保护模式
        };
    }
    return null;
}

// 采样率设置, 最基本的方式
export function sampling(sample) {
    return Math.random() * 100 <= sample;
}


