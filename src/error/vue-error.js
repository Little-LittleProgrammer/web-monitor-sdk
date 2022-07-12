
import error_report from '../http/error-report';
import { get_page_url, get_error_uid,parse_stack_frames } from '../utils/tools/index';
import { get_vue2_component_name, get_vue_version } from '../utils/vue'
import { enumsError } from '../utils/enums';

import { config } from '../config';

export function vue_error() {
    if (config.vue && config.vue.Vue) {
        const { Vue } = config.vue;
        const _version = get_vue_version(Vue)
        Vue.config.errorHandler = (err, vm, info) => {
            let componentName = ''
            if ( _version == '2' ) {
                componentName = get_vue2_component_name(vm, false);
            } else if ( _version == '3' ) {
                componentName = get_vue3_component_name(vm, false);
            }

            const _data = {
                type: 'error',
                subType: enumsError.VE,
                startTime: performance.now(),
                pageUrl: get_page_url(),
                extraData: {
                    errorUid: get_error_uid(`vue-error-${err.message}-${componentName}-${info}`),
                    type: err.name,
                    msg: err.stack || err.message,
                    // 解析后的错误堆栈
                    stackTrace: {
                        frames: parse_stack_frames(err),
                    },
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
