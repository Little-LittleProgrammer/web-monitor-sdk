import { config } from '../config';
import { is_support_send_beacon } from '../utils/tools/index';

export function reportWithXHR(data) {
    const _xhr = new XMLHttpRequest()
    _xhr.open('post', config.url)
    _xhr.send(JSON.stringify(data))
}

// 如果支持 sendBeacon, 就使用sendBeacon
// sendBeacon 同步请求，当页面卸载或刷新时进行上报的话，不会阻塞页面的卸载或加载
export function post(data) {
    if (!config.postUrl) {
        console.error('请设置上传 URL 地址');
    }
    let _url = config.postUrl;
    _url += `?t=${Date.now()}`;
    return is_support_send_beacon() ? window.navigator.sendBeacon.call(window.navigator, _url, JSON.stringify(data)) : reportWithXHR;
}

