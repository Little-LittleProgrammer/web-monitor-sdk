import babel from 'rollup-plugin-babel';
import path from 'path'
import serve from 'rollup-plugin-serve' // 本地服务
import livereload from 'rollup-plugin-livereload' // 热更新

function resolve(dir) {
    console.log(path.join(__dirname, dir))
    return path.join(__dirname, dir);
}

export default {
    input: resolve('../src/index.js'),
    output: {
        file: resolve('../dist/monitor.js'),
        format: 'iife',
        name: 'monitor',
        sourcemap: true,
    },
    plugins: [
        serve(),
        livereload(),
        babel({
            extensions: ['.js']
        }),
    ]
}