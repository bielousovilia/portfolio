"use strict";

const gulp = require("gulp");
const webpack = require("webpack-stream");
const browsersync = require("browser-sync").create();
const sass = require('gulp-sass'); // из sass в css
const cleanCSS = require('gulp-clean-css'); // минификация css файлов
const uglify = require('gulp-uglify'); // минификация js файлов
const concat = require('gulp-concat'); // объединение файлов
const del = require('del'); // удаление файлов
const autoprefixer = require('gulp-autoprefixer'); //автопрефикс
const imageMin = require('gulp-imagemin'); //минификация картинок
const rename = require('gulp-rename');

const dist = "./dist/";
const pathLibsCSS = ['./node_modules/normalize.css/normalize.css',
'./node_modules/bootstrap/dist/css/bootstrap-grid.css'], // путь css 
  pathLibsJS = ['./src/testLibs/**/*.js']; // путь js

async function buildProject() { // создание новой папки с проектом
  let buildHtml = gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./dist/'));

  let buildCSS = gulp.src('./src/assets/css/**/*.css')
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(gulp.dest('./dist/assets/css/'));

  let buildFonts = gulp.src('./src/assets/fonts/**/*.*')
    .pipe(gulp.dest('./dist/assets/fonts/'));

  let buildImg = gulp.src('./src/assets/images/**/*.*')
    .pipe(imageMin({
      interlaced: true,
      progressive: true,
      optimizationLevel: 5,
      svgoPlugins: [{
        removeViewBox: true
      }]
    }))
    .pipe(gulp.dest('./dist/assets/images/'));

  let buildLibsCSS = gulp.src('./src/assets/libs/libs.css')
    .pipe(gulp.dest('./dist/assets/libs/'));
}

async function buildLibs() {
  let buildLibsCSS = gulp.src(pathLibsCSS)
    .pipe(concat('libs.css'))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(gulp.dest('./src/assets/libs/'));

  let buildLibsJS = gulp.src(pathLibsJS)
    .pipe(concat('libs.js'))
    .pipe(uglify({
      toplevel: true
    }))
    .pipe(gulp.dest('./src/assets/libs/'));
}

async function funcDel() { // удаление папки с проектом
  del.sync('./dist');
}

async function funcDelLibs() { // удаление папки с библиотеками
  del.sync('./src/assets/libs/');
}
// cобрали проект
gulp.task('buildProject', gulp.series(buildProject, funcDel));
gulp.task('buildLibs', gulp.series(buildLibs, funcDelLibs));

gulp.task("copy-html", () => {
  return gulp.src("./src/index.html")
    .pipe(gulp.dest(dist))
    .pipe(browsersync.stream());
});

gulp.task("build-js", () => {
  return gulp.src("./src/js/main.js")
    .pipe(webpack({
      mode: 'development',
      output: {
        filename: 'script.js'
      },
      watch: false,
      devtool: "source-map",
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  debug: true,
                  corejs: 3,
                  useBuiltIns: "usage"
                }]
              ]
            }
          }
        }]
      }
    }))
    .pipe(gulp.dest(dist))
    .on("end", browsersync.reload);
});

gulp.task("copy-assets", () => {
  return gulp.src("./src/**/*.*")
    .pipe(gulp.dest(dist))
    .on("end", browsersync.reload);
});

// gulp.task("sass", function() {
//   return gulp.src('./src/assets/**/*.scss')
//     .pipe(sass())
//     .pipe(autoprefixer({
//       overrideBrowserslist: ['last 5 versions']
//     }))
//     .pipe(gulp.dest('./src/assets/css/'))
//     .pipe(browsersync.stream());
// });

function styles() {
  return gulp.src('./src/assets/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 5 versions']
    }))
    .pipe(rename('style.css'))
    .pipe(gulp.dest('./src/assets/css/'))
    .pipe(browsersync.stream());
}


gulp.task("watchJS", () => {
  browsersync.init({
    server: "./dist/",
    port: 4000,
    notify: true
  });

  gulp.watch("./src/js/**/*.js", gulp.parallel("build-js"));
  gulp.watch("./src/index.html", gulp.parallel("copy-html"));
  gulp.watch("./src/**/*.*", gulp.parallel("copy-assets"));
});

gulp.task("watchStyles", () => {
  browsersync.init({
    server: "./dist/",
    port: 4000,
    notify: true
  });

  gulp.watch("./src/index.html", gulp.parallel("copy-html"));
  gulp.watch("./src/**/*.*", gulp.parallel("copy-assets"));
  gulp.watch("./src/assets/scss/*.scss", styles);
});

gulp.task("buildStyles", gulp.parallel("copy-html", "copy-assets", styles));
// gulp.task("buildJS", gulp.parallel("build-js",));

gulp.task("build-prod-js", () => {
  return gulp.src("./src/js/main.js")
    .pipe(webpack({
      mode: 'production',
      output: {
        filename: 'script.js'
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  corejs: 3,
                  useBuiltIns: "usage"
                }]
              ]
            }
          }
        }]
      }
    }))
    .pipe(gulp.dest(dist));
});

// gulp.task("default", gulp.parallel("watch", "build"));
gulp.task("Styles", gulp.parallel("watchStyles", "buildStyles"));
gulp.task("JS", gulp.parallel("watchJS", "build-js"));