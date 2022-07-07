import { is_support_performance_observer, get_page_url } from '../utils/tools';
import performance_report from '../http/performance-report';
import { enumsPerformance } from '../utils/enums';

/**
 * 记录  用户首次输入的延迟
 * @returns null
 */
export function observe_fid() {
    if (!is_support_performance_observer()) {
        return;
    }
    function entry_handler(list) {
        if (_observe) {
            _observe.disconnect();
        }
        for (const entry of list.getEntries()) {
            const _reportData = {
                type: 'performance',
                subType: enumsPerformance.FID,
                pageURL: get_page_url(),
                extraData: {
                    ...entry.toJSON()
                }
            };
            performance_report(_reportData);
        }
    }
    const _observe = new PerformanceObserver(entry_handler);
    _observe.observe({ type: 'first-input', buffered: true });
}
