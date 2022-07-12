
import error_report from '../http/error-report';
import { get_error_uid, get_page_url, parse_stack_frames } from '../utils/tools/index';
import { enumsError } from '../utils/enums';

export function js_error() {
    window.addEventListener('error', (e) => {
        // 阻止抛出控制台错误
        e.preventDefault();
        // 如果不是 JS异常 就结束
        if (e.message === 'Script error.') return;
        const _data = {
            type: 'error',
            subType: enumsError.JE,
            startTime: e.timeStamp,
            pageURL: get_page_url(),
            extraData: {
                type: (e.error && e.error.name) || 'UnKnown',
                msg: e.stack || e.message,
                errorUid: get_error_uid(`js-error-${e.message}-${e.filename}`),
                meta: {
                    // file 错误所处的文件地址
                    file: e.filename,
                    // col 错误列号
                    col: e.colno,
                    // row 错误行号
                    row: e.lineno
                },
                // 解析后的错误堆栈
                stackTrace: {
                    frames: parse_stack_frames(e.error),
                },
            }

        };
        error_report(_data);
    }, true);
}
