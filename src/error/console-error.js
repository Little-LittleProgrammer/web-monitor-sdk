import error_report from '../http/error-report';
import { get_page_url, get_error_uid } from '../utils/tools/index';
import { enumsError } from '../utils/enums';

// 用户console.error捕获
export function console_error() {
    window.console.error = (...args) => {
        error_report({
            type: 'error',
            subType: enumsError.CE,
            startTime: performance.now(),
            pageURL: get_page_url(),
            extraData: {
                errorUid: get_error_uid(`console-error-${args[0]}`),
                msg: args,
                meta: {}
            }
        });
    };
}
