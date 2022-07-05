
import error_report from '../http/error-report';
import { get_error_uid, get_page_url } from '../utils/tools';
import { enumsError } from '../utils/enums';

export function js_error() {
    window.addEventListener('error', (e) => {
        // 阻止抛出控制台错误
        e.preventDefault();
        const _data = {
            type: 'error',
            subType: enumsError.JE,
            startTime: e.timeStamp,
            pageURL: get_page_url(),
            errorUid: get_error_uid(`js-error-${e.message}-${e.filename}`),
            extraObj: {
                meta: {
                    // file 错误所处的文件地址
                    file: e.filename,
                    // col 错误列号
                    col: e.colno,
                    // row 错误行号
                    row: e.lineno
                },
                errorMsg: e.stack || e.message
            }

        };
        error_report(_data);
    }, true);
}
