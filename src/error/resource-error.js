import { get_page_url, get_error_uid } from '../utils/tools/index';
import error_report from '../http/error-report';
import { enumsError } from '../utils/enums';

export function resource_error() {
    window.addEventListener('error', (e) => {
        // 阻止抛出控制台错误
        e.preventDefault();
        const { target } = e;
        if (!target) return;
        const _url = target.src || target.href;
        if (_url) {
            const _data = {
                type: 'error',
                subType: enumsError.RE,
                startTime: e.timeStamp,
                pageURL: get_page_url(),
                extraData: {
                    type: 'ResourceError',
                    msg: '',
                    errorUid: get_error_uid(`resource-error-${target.src}-${target.tagName}`),
                    meta: {
                        url: _url,
                        html: target.outerHTML,
                        type: target.tagName,
                        paths: e.path.map((item) => item.tagName).filter((i) => i)
                    },
                }

            };
            error_report(_data);
        }
    }, true);
}
