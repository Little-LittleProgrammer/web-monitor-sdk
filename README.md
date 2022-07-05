# 简介
此为前端监控系统中的`SDK`部分，主要包含一下方面的功能
1. 前端异常监控
2. 页面性能采集

# 目标功能
## 异常捕获
1. 支持 js 错误异常捕获
2. 支持 vue 错误捕获
3. 支持 promise 错误捕获
4. 支持 用户自定 `console.error()`捕获
5. 资源加载错误捕获
6. http 通讯异常捕获

## 性能监控
1. 资源文件收集
    - 资源名称、资源类型
    - 资源大小、资源加载耗时
    - 是否命中缓存、资源请求协议
    - 资源压缩比、资源压缩前大小、资源解压后大小
    - 资源 DNS 耗时
    - ....
2. FCP首次内容绘制
3. FP首次绘制
4. TTI首次可交互时间
5. DOM加载完成时间
6. 白屏时间
7. LCP最大内容绘制时间

### navitation-timing 关键时间点

[!image](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce6f41887a9a469f8384e3302b576850~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)


# 目录
```js
src // 功能目录
 |- performance // 性能收集
 |- error // error 收集
 |- utils // 工具类
 |- http // 数据上报a
 |- index.js // 初始化，对外暴露 init 方法
```

# 描述
1. index 配置项
    - 项目url
    - 数据上报地址
    - 项目名称
    - 项目首次加载是否展示本次性能数据
    - vue项目传递vue实例
2. http 数据上报
    - 封装 ajax 请求
    - 上报时机
        - 不能阻塞项目：
        - 不能使用异步：防止页面关闭或刷新时通讯被浏览器cancel
3. utils 工具
    - tools
        - deep_copy
        - get_uuid
        - get_page_url
        - is_support_send_beacon
    - cache
        - add_cache
        - clear_cache
        - get_cache
    - listen 
