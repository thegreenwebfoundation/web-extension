// rollup.config.js

import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

// define the plugins here, as we use them the same way each time
const plugins = [
  resolve(),
  commonjs(),
]

export default [
  // main background script
  {
    input: 'thegreenweb/background.js',
    output: {
      file: 'thegreenweb/background.dist.js',
      format: 'iife',
    },
    plugins,
  },
  // options page
  {
    input: 'thegreenweb/options.js',
    output: {
      file: 'thegreenweb/options.dist.js',
      format: 'iife',
    },
    plugins,
  },
  // general-green-links
  {
    input: 'thegreenweb/green-page-links.js',
    output: {
      file: 'thegreenweb/green-page-links.dist.js',
      format: 'iife',
    },
    plugins
  },
  {
    input: 'thegreenweb/search-bing.js',
    output: {
      file: 'thegreenweb/search-bing.dist.js',
      format: 'iife',
    },
    plugins
  },
  // ecosia
  {
    input: 'thegreenweb/search-ecosia.js',
    output: {
      file: 'thegreenweb/search-ecosia.dist.js',
      format: 'iife',
    },
    plugins
  },
  // yahoo
  {
    input: 'thegreenweb/search-yahoo.js',
    output: {
      file: 'thegreenweb/search-yahoo.dist.js',
      format: 'iife',
    },
    plugins
  },
  // google
  {
    input: 'thegreenweb/search-google.js',
    output: {
      file: 'thegreenweb/search-google.dist.js',
      format: 'iife',
    },
    plugins
  }
  ,

]
