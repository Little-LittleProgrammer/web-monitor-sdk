
import error_report from '../http/error-report';
import { get_page_url, get_error_uid, parse_stack_frames } from '../utils/tools/index';
import { enumsError } from '../utils/enums';

export function promise_error() {
    window.addEventListener('unhandledrejection', (e) => {
        const _msg = e.reason.stack || e.reason.message || e.reason;
        const _type = e.reason.name || 'UnKnown';
        error_report({
            type: 'error',
            subType: enumsError.PE,
            startTime: e.timeStamp,
            pageUrl: get_page_url(),
            extraData: {
                type: _type,
                msg: _msg,
                stackTrace: {
                    frames: parse_stack_frames(e.reason),
                },
                errorUid: get_error_uid(`promise-error-${_msg}`),
                meta: {}
            }
        });
    });
}
