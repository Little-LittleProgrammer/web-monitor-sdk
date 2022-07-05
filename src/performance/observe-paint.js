import { is_support_performance_observer, get_network_info, get_page_url } from '../utils/tools';
import performance_report from '../http/performance-report';

// 收集 FP, FCP数据
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
            const _networkInfo = get_network_info();
            if (_networkInfo) {
                _reportData.networkInfo = {
                    ..._networkInfo
                };
            }
            performance_report(_reportData);
        }
    }
    const _observer = new PerformanceObserver(entry_handler);
    _observer.observe({ type: 'paint', buffered: true });
}
