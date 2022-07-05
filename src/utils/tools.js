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

export function get_error_uid(input) {
    return window.btoa(unescape(encodeURIComponent(input)));
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

// 是否支持 performanceObserver
export function is_support_performance_observer() {
    return !!window.PerformanceObserver;
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


export const scores = {
    fp: [500, 1500],
    fcp: [1500, 3000],
    lcp: [2500, 4000],
    fid: [100, 250],
    tbt: [300, 600],
    cls: [0.1, 0.25]
};

export const scoreLevel = ['good', 'needsImprovement', 'poor'];

/**
 * 评分
 * @param {*} type 当前性能类型
 * @param {*} data 性能指数
 * @returns 结果
 */
export const get_score = (type, data) => {
    const score = scores[type];
    for (let i = 0; i < score.length; i++) {
        if (data <= score[i]) return scoreLevel[i];
    }

    return scoreLevel[2];
};

// 来源：稀土掘金
// 获取报错组件名
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, '');
const ROOT_COMPONENT_NAME = '<Root>';
const ANONYMOUS_COMPONENT_NAME = '<Anonymous>';
export function get_component_name(vm, includeFile) {
    if (!vm) {
        return ANONYMOUS_COMPONENT_NAME;
    }
    if (vm.$root === vm) {
        return ROOT_COMPONENT_NAME;
    }
    const options = vm.$options;
    let name = options.name || options._componentTag;
    const file = options.__file;
    if (!name && file) {
        const match = file.match(/([^/\\]+)\.vue$/);
        if (match) {
            name = match[1];
        }
    }
    return (
        (name ? `<${classify(name)}>` : ANONYMOUS_COMPONENT_NAME) + (file && includeFile !== false ? ` at ${file}` : '')
    );
}

// 采样率设置, 最基本的方式
export function sampling(sample) {
    return Math.random() * 100 <= sample;
}
