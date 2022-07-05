// 页面关闭前
export function on_beforeunload(callback) {
    window.addEventListener('beforeunload', callback, true);
}

/**
 * 页面进入后台
 * @param {*} callback 回调方法
 * @param {*} once 是否只执行1次
 */
export function on_hidden(callback, once) {
    const hidden = (e) => {
        if (e.type === 'pagehide' || document.visibilityState === 'hidden') {
            callback(e);
            if (once) {
                window.removeEventListener('visibilitychange', hidden, true);
                window.removeEventListener('pagehide', hidden, true);
            }
        }
    };
    window.addEventListener('visibilitychange', hidden, true);
    window.addEventListener('pagehide', hidden, true);
}

/**
 * 监听页面加载
 * @param {*} callback 执行的方法
 */
export function on_load(callback) {
    if (document.readyState === 'complete') {
        callback();
    } else {
        const onLoad = () => {
            callback();
            window.removeEventListener('load', onLoad, true);
        };
        window.addEventListener('load', onLoad, true);
    }
}
