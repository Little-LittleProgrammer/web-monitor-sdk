import { report } from './report';

const submitErrorUids = [];
export default function error_report(data) {
    const _hasSubmitStatus = submitErrorUids.includes(data.errorUid);
    // 判断同一个错误在本次页面访问中是否已经发生过;
    if (_hasSubmitStatus) return;
    submitErrorUids.push(data.errorUid);
    // 错误要立即上报
    report(data);
}
