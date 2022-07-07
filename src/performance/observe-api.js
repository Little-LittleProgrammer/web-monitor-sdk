import performance_report from '../http/performance-report';
import { enumsPerformance } from '../utils/enums';


function overwrite_xhr() {
    // 拦截请求, 重写方法xhr
    const _xhr = XMLHttpRequest.prototype;
    const _open = _xhr.open;
    const _send = _xhr.send;
    _xhr.open = function new_open(...args) {
        this.url = args[1].split('?')[0];
        this.method = args[0];
        _open.apply(this, args);
    };
    _xhr.send = function new_send(...args) {
        this.startTime = Date.now();

        const onLoadend = () => {
            this.endTime = Date.now();
            this.duration = this.endTime - this.startTime;

            const { status, duration, startTime, endTime, url, method } = this;
            const _reportData = {
                type: 'performance',
                subType: enumsPerformance.API,
                extraData: {
                    status,
                    duration,
                    startTime,
                    endTime,
                    url,
                    method: (method || 'GET').toUpperCase(),
                    success: status >= 200 && status < 300
                }
            };

            performance_report(_reportData);

            this.removeEventListener('loadend', onLoadend, true);
        };

        this.addEventListener('loadend', onLoadend, true);
        _send.apply(this, args);
    };
}

const originalFetch = window.fetch;

function overwrite_fetch() {
    window.fetch = function new_fetch(url, config) {
        const startTime = Date.now();
        const _reportData = {
            type: 'performance',
            subType: enumsPerformance.API,
            extraData: {
                startTime,
                url,
                method: (config?.method || 'GET').toUpperCase()
            }
        };

        return originalFetch(url, config)
            .then((res) => {
                const _data = res.clone();
                const _endTime = Date.now();
                _reportData.extraData = {
                    ..._reportData.extraData,
                    endTime: _endTime,
                    duration: _endTime - _reportData.extraData.startTime,
                    status: _data.status,
                    success: _data.ok
                };

                performance_report(_reportData);

                return res;
            })
            .catch((err) => {
                const _endTime = Date.now();
                _reportData.extraData = {
                    ..._reportData.extraData,
                    endTime: _endTime,
                    duration: _endTime - _reportData.extraData.startTime,
                    status: 0,
                    success: false
                };
                performance_report(_reportData);

                throw err;
            });
    };
}

/**
 * 监测 api接口
 */
export function observe_api() {
    overwrite_xhr();
    overwrite_fetch();
}
