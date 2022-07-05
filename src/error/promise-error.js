
import error_report from '../http/error-report';
import { get_page_url, get_error_uid } from '../utils/tools';
import { enumsError } from '../utils/enums';

export function promise_error() {
    window.addEventListener('unhandledrejection', (e) => {
        const _msg = e.reason.stack || e.reason.message || e.reason;
        error_report({
            type: 'error',
            subType: enumsError.PE,
            startTime: e.timeStamp,
            pageUrl: get_page_url(),
            errorUid: get_error_uid(`promise-error-${_msg}`),
            extraObj: {
                errorMsg: e.reason.stack || e.reason
            }
        });
    });
}
