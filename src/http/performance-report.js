import { lazy_report_cache } from './report';

// const submitErrorUids = [];
export default function performance_report(data, timeOut = 3000) {
    // 预留性能上报增加功能位置
    // 性能数据延迟上报
    lazy_report_cache(data, timeOut);
}
