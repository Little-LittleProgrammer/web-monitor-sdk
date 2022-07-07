import performance_report from '../http/performance-report';
import { get_page_url } from '../utils/tools';

export function observe_vue_router(Vue, router) {
    let _isFirst = true;
    let _startTime;
    router.beforeEach((to, form, next) => {
        // 首次进入页面已经有其他统计的渲染时间可用
        if (_isFirst) {
            _isFirst = false;
            next();
        }

        // 给 router 新增一个字段，表示是否要计算渲染时间
        // 只有路由跳转才需要计算
        router.needCalculateRenderTime = true;
        _startTime = performance.now();

        next();
    });

    let _timer;
    Vue.mixin({
        mounted() {
            if (!router.needCalculateRenderTime) return;

            this.$nextTick(() => {
                // 仅在整个视图都被渲染之后才会运行的代码
                const now = performance.now();
                clearTimeout(_timer);

                _timer = setTimeout(() => {
                    router.needCalculateRenderTime = false;
                    const _reportData = {
                        type: 'performance',
                        subType: 'vue-router-change-paint',
                        pageURL: get_page_url(),
                        extraData: {
                            startTime: now,
                            duration: now - _startTime
                        }
                    };
                    performance_report(_reportData);
                }, 1000);
            });
        }
    });
}
