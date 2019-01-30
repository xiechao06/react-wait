import pkg from './package.json'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'

export default [
  {
    input: pkg.source,
    output: {
      file: pkg.main,
      format: 'cjs'
    },
    plugins: [
      babel({ runtimeHelpers: true }),
      resolve(),
      commonjs()
    ],
    external: ['react']
  },
  {
    input: pkg.source,
    output: {
      file: pkg.module,
      format: 'es',
      sourcemap: 'inline'
    },
    plugins: [
      babel({ runtimeHelpers: true }),
      resolve(),
      commonjs()
    ],
    external: ['react']
  },
  {
    input: pkg.source,
    output: {
      file: 'dist/react-wait2.browser.js',
      format: 'iife',
      name: 'reactWait',
      globals: {
        react: 'React'
      },
      sourcemap: 'inline'
    },
    plugins: [
      babel({ runtimeHelpers: true }),
      resolve(),
      commonjs()
    ],
    external: ['react']
  },
  {
    input: pkg.source,
    output: {
      file: 'dist/react-wait2.browser.min.js',
      format: 'iife',
      name: 'reactWait',
      globals: {
        react: 'React'
      },
      sourcemap: 'inline'
    },
    plugins: [
      babel({ runtimeHelpers: true }),
      resolve(),
      commonjs(),
      uglify()
    ],
    external: ['react']
  }
]
