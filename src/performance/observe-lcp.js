import { is_support_performance_observer, get_page_url } from '../utils/tools';
import performance_report from '../http/performance-report';
import { enumsPerformance } from '../utils/enums';

let _lcpFlag = false; // lcp性能监测是否完成, 用于 首屏渲染时间

export function is_lcp_done() {
    return _lcpFlag;
}

/**
 * 记录 最大内容绘制时间
 * @returns null
 */
export function observe_lcp() {
    if (!is_support_performance_observer()) {
        _lcpFlag = true;
        return;
    }
    function entry_handler(list) {
        _lcpFlag = true;
        if (_observer) {
            _observer.disconnect();
        }
        for (const entry of list.getEntries()) {
            const _reportData = {
                type: 'performance',
                subType: entry.entryType,
                pageURL: get_page_url(),
                extraData: {
                    ...entry.toJSON()
                }
            };
            performance_report(_reportData);
        }
    }
    const _observer = new PerformanceObserver(entry_handler);
    _observer.observe({ type: enumsPerformance.LCP, buffered: true });
}
