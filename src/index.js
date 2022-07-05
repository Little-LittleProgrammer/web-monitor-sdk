import { set_config, config } from './config';
import { error } from './error/index';
import { performance } from './performance/index';
import { get_cache, clear_cache } from './utils/cache';
import { sampling } from './utils/tools';
import { on_beforeunload, on_hidden } from './utils/listen';
import { report } from './http/report';

const qmWebMonitor = {
    init(options = {}) {
        try {
            set_config(options);
            if (config.error) {
                error(); // 错误数据是立即上报的
            }

            if (sampling(config.sample)) {
                // 行为和性能数据延迟上报
                if (config.performance) {
                    performance();
                }
                if (config.behavior) {
                    // 行为
                }
                if (config.performance || config.behavior) {
                    const _callback = () => {
                        const _data = get_cache();
                        if (_data.length > 0) {
                            report(_data, true);
                            clear_cache();
                        }
                    };
                    // 当页面进入后台或关闭前，将剩余所有数据进行上报
                    on_beforeunload(_callback);
                    on_hidden(_callback);
                }
            }
        } catch (err) {
            console.log('SDK出错, 已停用采集功能', err);
        }
    }
};
export default qmWebMonitor;
