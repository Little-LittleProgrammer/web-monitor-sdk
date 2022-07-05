
import error_report from '../http/error-report';
import { get_page_url, get_error_uid, get_component_name } from '../utils/tools';
import { enumsError } from '../utils/enums';

import { config } from '../config';

export function vue_error() {
    if (config.vue && config.vue.Vue) {
        const { Vue } = config.vue;
        Vue.config.errorHandler = (err, vm, info) => {
            const componentName = get_component_name(vm, false);
            const _data = {
                type: 'error',
                subType: enumsError.VE,
                startTime: performance.now(),
                pageUrl: get_page_url(),
                errorUid: get_error_uid(`vue-error-${err.message}-${componentName}-${info}`),
                extraObj: {
                    errorMsg: err.stack || err.message,
                    meta: {
                        componentName, // 报错的Vue组件名
                        hook: info // 报错的Vue阶段
                    }
                }
            };
            error_report(_data);
        };
    }
}
