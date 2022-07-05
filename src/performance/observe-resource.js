import { on_load } from '../utils/listen';
import { is_support_performance_observer, get_network_info } from '../utils/tools';
import performance_report from '../http/performance-report';
import { enumsPerformance } from '../utils/enums';

export function observe_resource() {
    on_load(() => {
        observe_event(enumsPerformance.RF); // 单个资源指标
        observe_event(enumsPerformance.NT); // 总体指标
    });
}

let _hasAlreadyCollected = false;
export function observe_event(entryType) {
    function entry_handler(list) {
        const _data = list.getEntries ? list.getEntries() : list;
        for (const entry of _data) {
            if (entryType === 'navigation') { // navigation只会存在一条
                if (_hasAlreadyCollected) return;
                if (_observer) {
                    _observer.disconnect();
                }
                _hasAlreadyCollected = true;
            }
            // nextHopProtocol 属性为空，说明资源解析错误或者跨域
            // beacon 用于上报数据，所以不统计。xhr fetch 单独统计
            if ((!entry.nextHopProtocol && entryType !== 'navigation') || filter(entry.initiatorType)) {
                return;
            }
            const _reportData = {
                type: 'performance',
                subType: entryType,
                extraData: {
                    name: entry.name.split('/')[entry.name.split('/').length - 1], // 资源名称
                    sourceType: entry.initiatorType, // 资源类型
                    duration: entry.duration, // 资源加载耗时
                    redirect: (entry.redirectEnd - entry.redirectStart), // 重定向耗时
                    dns: (entry.domainLookupEnd - entry.domainLookupStart), // DNS 耗时
                    tcp: (entry.connectEnd - entry.connectStart), // 建立 tcp 连接耗时
                    request: (entry.responseStart - entry.requestStart), // 请求耗时
                    response: (entry.responseEnd - entry.responseStart), // 响应耗时
                    ttfb: entry.responseStart, // 首字节时间
                    transferSize: entry.transferSize, // 资源大小
                    protocol: entry.nextHopProtocol, // 请求协议
                    encodedBodySize: entry.encodedBodySize, // 资源解压前响应内容大小
                    decodedBodySize: entry.decodedBodySize, // 资源解压后的大小
                    resourceRatio: (entry.decodedBodySize / entry.encodedBodySize) || 1,
                    isCache: is_cahce(entry), // 是否命中缓存
                    startTime: performance.now()
                }
            };
            const _networkInfo = get_network_info();
            if (_networkInfo) {
                _reportData.networkInfo = {
                    ..._networkInfo
                };
            }
            performance_report(_reportData);
        }
    }
    let _observer;
    if (is_support_performance_observer()) {
        _observer = new PerformanceObserver(entry_handler);
        _observer.observe({ type: entryType, buffered: true });
    } else {
        const data = window.performance.getEntriesByType(entryType);
        entry_handler(data);
    }
}

// 不统计以下类型的资源
// fetch\beacon 表示请求
// xmlhttprequest 表示响应
const preventType = ['fetch', 'xmlhttprequest', 'beacon'];
const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
if (isSafari) {
    // safari 会把接口请求当成 other
    preventType.push('other');
}

function filter(type) {
    return preventType.includes(type);
}

function is_cahce(entry) {
    // 直接从缓存读取或 304
    return entry.transferSize === 0 || (entry.transferSize !== 0 && entry.encodedBodySize === 0);
}
