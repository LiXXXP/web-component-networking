/* eslint-disable no-console */
const del = require('del')
const { src, dest, series, parallel } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
// 打包配置
const config = {
  input: '../packages/theme-default/',
  output: '../lib/theme-default'
}
// 复制svg
const copySvg = () => src([`${config.input}icons/**/*`]).pipe(dest(`${config.output}/icons`))
// 复制字体
const copyfont = () =>
  src([`${config.input}fonts/*`, `!${config.input}fonts/*.css`]).pipe(dest(`${config.output}/fonts`))
// 删除之前css打包文件
const clean = (done) => {
  del(
    ['*.css', 'icons', 'fonts'].map((name) => `${config.output}/${name}`),
    { force: true }
  )
  done()
}

// 编译 SCSS
const compile = () =>
  src([`${config.input}*.scss`, ...['base', 'variable'].map((name) => `!${config.input}${name}.scss`)])
    .pipe(sass.sync())
    .pipe(
      autoprefixer({
        cascade: false
      })
    )
    .pipe(
      cleanCSS({}, (details) => {
        console.log(
          `${details.name}: ${details.stats.originalSize / 1000} KB -> ${details.stats.minifiedSize / 1000} KB`
        )
      })
    )
    .pipe(dest(config.output))
exports.build = series(clean, parallel(compile, copySvg, copyfont))
