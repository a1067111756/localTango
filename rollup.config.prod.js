import path from 'path'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import { visualizer } from 'rollup-plugin-visualizer'
import { nodeResolve } from '@rollup/plugin-node-resolve'

module.exports = {
  input: path.resolve(__dirname, './src/index.ts'), // 入口文件
  output: [
    {
      // 打包umd格式文件
      file: path.resolve(__dirname, './dist/bundle.min.umd.js'), // 输出路劲
      format: 'umd', // umd - 统一兼容模式 cjs - commonJs模式 ejs - es6模式
      name: 'RollupLib', // 对外暴露的顶级变量
      exports: 'auto'
    },
    {
      // 打包es格式文件
      file: path.resolve(__dirname, './dist/bundle.min.es.js'), // 输出路劲
      format: 'es', // umd - 统一兼容模式 cjs - commonJs模式 ejs - es6模式
      name: 'RollupLib', // 对外暴露的顶级变量
      exports: 'auto'
    },
    {
      // 打包es格式文件
      file: path.resolve(__dirname, './dist/bundle.min.common.js'), // 输出路劲
      format: 'cjs', // umd - 统一兼容模式 cjs - commonJs模式 es - es6模式
      name: 'RollupLib', // 对外暴露的顶级变量
      exports: 'auto'
    }
  ],
  // 排除打包的资源
  external: ['vue'],
  // 插件
  plugins: [
    nodeResolve(), // 三方依赖打包
    commonjs(), // 支持commonJs语法
    babel({ babelHelpers: 'bundled', }), // babel语法转义
    typescript({ sourceMap: false }),
    json(), // 支持引用json文件
    terser(), // 压缩插件
    visualizer() // 包分析工具
  ]
}
