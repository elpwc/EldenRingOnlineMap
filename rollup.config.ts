import { defineConfig } from 'rollup';
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import { svelteSVG } from "rollup-plugin-svelte-svg";
import sveltePreprocess from 'svelte-preprocess';
import css from 'rollup-plugin-css-only';
import json from '@rollup/plugin-json';
import { babel } from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete'

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true,
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}
const extensions = ['.js', '.ts', '.svelte']

export default defineConfig({
  input: 'src/main.ts',
  output: {
    sourcemap: true,
    format: 'es',
    name: 'app',
    dir: 'public/build',
  },
  // Be careful about the plugins order!!!
  plugins: [
    del({ targets: 'public/build/*.js*' }),
    json(),
    svelteSVG({
      // optional SVGO options
      // pass empty object to enable defaults
      svgo: {}
    }),
    svelte({
      preprocess: sveltePreprocess({ sourceMap: !production }),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),
    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      extensions,
      preferBuiltins: false,
      browser: true,
      dedupe: ['svelte'],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
    }),
    commonjs(),

    // compile to good old IE11 compatible ES5
    babel({
      extensions,
      babelHelpers: 'runtime',
      exclude: ['node_modules/**'],
    }),

    // leaflet.css 里含有路径来引用图标，将其静态资源拷贝到 bundle.css 的生成路径下
    copy({
      targets: [{ src: 'node_modules/leaflet/dist/images', dest: 'public/build/' }],
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: 'bundle.css' }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
});
