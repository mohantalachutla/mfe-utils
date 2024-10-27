// rollup.config.js
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
const isProd = process.env.NODE_ENV === 'production'
export default {
  input: 'src/index.js',
  output: [
    {
      file: 'lib/index.js',
      format: 'esm',
    },
    {
      file: 'lib/index.cjs',
      format: 'cjs',
    },
    {
      name: 'utils',
      file: 'lib/index.umd.js',
      format: 'umd',
    },
    {
      file: 'lib/index.iife.js',
      format: 'iife',
    },
    {
      file: 'lib/index.system.js',
      format: 'iife',
    },
    {
      file: 'lib/index.amd.js',
      format: 'amd',
    },
    // {
    //   file: 'lib/index.min.js',
    //   format: 'esm',
    //   plugins: [terser({ module: true })],
    // },
  ],
  plugins: [
    resolve(),
    commonjs(),
    isProd && import('@rollup/plugin-terser').then((terser) => terser.default),
  ],
}
