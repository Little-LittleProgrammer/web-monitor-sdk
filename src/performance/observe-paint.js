import { is_support_performance_observer, get_page_url } from '../utils/tools/index';
import performance_report from '../http/performance-report';

/**
 * 监测 FP(首次绘制) 和 FCP(首次内容绘制) 时间
 */
export function observe_paint() {
    if (!is_support_performance_observer()) return;
    function entry_handler(list) {
        for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
                _observer.disconnect();
            }
            const _reportData = {
                type: 'performance',
                subType: entry.name,
                pageURL: get_page_url(),
                extraData: {
                    ...entry.toJSON()
                }
            };
            performance_report(_reportData);
        }
    }
    const _observer = new PerformanceObserver(entry_handler);
    _observer.observe({ type: 'paint', buffered: true });
}
