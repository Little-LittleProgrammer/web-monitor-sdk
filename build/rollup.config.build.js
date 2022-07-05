import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser'
import path from 'path'
function resolve(dir) {
    return path.join(__dirname, dir);
}

const _plugins = [
    terser(),
    babel({
        extensions: ['.js'],
    }),
]

export default [{
    input: resolve('../src/index.js'),
    output: {
        file: resolve('../dist/monitor.cjs.js'),
        format: 'cjs',
        name: 'monitor',
        sourcemap: false,
    },
    plugins: _plugins
}, {
    input: resolve('../src/index.js'),
    output: {
        file: resolve('../dist/monitor.esm.js'),
        format: 'es',
        name: 'monitor',
        sourcemap: false,
    },
    plugins: _plugins
}]