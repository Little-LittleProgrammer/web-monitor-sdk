const config = {
    postUrl: '', // 上报地址
    appID: '', // 项目ID
    appName: '', // 项目名称
    userID: '', // 用户ID
    cacheNum: 50, // 上报缓存
    sample: 100, // 1 / sample的概率
    performance: true,
    behavior: true,
    error: true,
    vue: { // Vue实例
        Vue: null,
        router: null
    }
};

export function set_config(options) {
    for (const key in config) {
        if (options[key]) {
            config[key] = options[key];
        }
    }
}

export { config };

