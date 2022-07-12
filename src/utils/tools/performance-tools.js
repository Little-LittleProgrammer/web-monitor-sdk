// 是否支持 performanceObserver
export function is_support_performance_observer() {
    return !!window.PerformanceObserver;
}

export const scores = {
    fp: [500, 1500],
    fcp: [1500, 3000],
    lcp: [2500, 4000],
    fid: [100, 250],
    tbt: [300, 600],
    cls: [0.1, 0.25]
};

export const scoreLevel = ['good', 'needsImprovement', 'poor'];

/**
 * 评分
 * @param {*} type 当前性能类型
 * @param {*} data 性能指数
 * @returns 结果
 */
export const get_score = (type, data) => {
    const score = scores[type];
    for (let i = 0; i < score.length; i++) {
        if (data <= score[i]) return scoreLevel[i];
    }

    return scoreLevel[2];
};