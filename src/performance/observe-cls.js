import { is_support_performance_observer, get_network_info, get_page_url, deep_copy } from '../utils/tools';
import { on_hidden } from '../utils/listen';
import performance_report from '../http/performance-report';
import { enumsPerformance } from '../utils/enums';

// 页面元素偏移的累积分数 采用的是谷歌定的规则, 5秒内的页面中的一个会话窗口的偏移, 每间隔一秒进行计算
// 布局偏移分数 = 影响分数 * 距离分数
export function observe_cls() {
    if (!is_support_performance_observer()) return;

    let _sessionValue = 0;
    let _sessionEntries = [];
    const _reportData = {
        type: 'performance',
        subType: enumsPerformance.CLS,
        pageURL: get_page_url(),
        extraData: {
            value: 0
        }
    };

    function entry_handler(list) {
        // cls 不disconnect 是因为页面中的cls会更新
        for (const entry of list.getEntries()) {
            // 只记录最近用户没有输入行为的ls(layout shifts)
            if (!entry.hadRecentInput) {
                const _firstSessionEntry = _sessionEntries[0];
                const _lastSessionEntry = _sessionEntries[_sessionEntries.length - 1];
                /*
                    如果该会话窗口与 前一个会话窗口的时间间隔小于1秒，
                    且与会话中的第一个会话窗口的时间间隔小于5秒，
                    则表示这些会话窗口为此会话窗口的偏移过程。否则，浏览器会计算为新的窗口
                    详细看 https://web.dev/evolving-cls/
                */
                if (_sessionValue
                    && entry.startTime - _lastSessionEntry.startTime < 1000
                    && entry.startTime - _firstSessionEntry.startTime < 5000) {
                    _sessionValue += entry.value;
                    _sessionEntries.push(format_cls_entry(entry));
                } else {
                    _sessionValue = entry.value;
                    _sessionEntries = [format_cls_entry(entry)];
                }

                // 如果当前会话值大于当前CLS值，则更新, 找出最大的cls
                if (_sessionValue > _reportData.extraData.value) {
                    _reportData.extraData = {
                        entry,
                        value: _sessionValue,
                        entries: _sessionEntries
                    };
                    const _networkInfo = get_network_info();
                    if (_networkInfo) {
                        _reportData.networkInfo = {
                            ..._networkInfo
                        };
                    }
                    performance_report(deep_copy(_reportData));
                }
            }
        }
    }

    const _observer = new PerformanceObserver(entry_handler);
    _observer.observe({ type: 'layout-shift', buffered: true });

    if (_observer) {
        on_hidden(() => {
            _observer.takeRecords().map(entry_handler);
        });
    }
}

function format_cls_entry(entry) {
    const _result = entry.toJSON();
    delete _result.duration;
    delete _result.sources;

    return _result;
}
