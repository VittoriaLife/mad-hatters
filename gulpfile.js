const {src, dest, watch, parallel, series} = require('gulp');
const css = require('gulp-sass'); // scss в ccs
const concat = require('gulp-concat'); // объедиение файлов в один и переименование
const browserSync = require('browser-sync').create(); // liveserver
const uglify =  require('gulp-uglify-es').default; // минификация js
const autoprefixer = require('gulp-autoprefixer'); // автоматические префиксы
const imagemin = require('gulp-imagemin'); // сжатие картинок
const webp = require('gulp-webp');
const del = require('gulp-delete'); // очищение папки
const gulpWebp = require('gulp-webp');

// функ-я запуска liveserver
function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'app/'
    }
  });
}


//функ-я  сжатия картинок
function images() {
  return src('app/img/*')
    .pipe(imagemin(
      [
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
      ]
    ))
    .pipe(dest('dist/img')) // куда кидаем
}


// функ-я для превращения  картинок других форматов в wepb
function webpImage () {
  return src('app/img/**/*.{png, jpg, jpeg}')
    .pipe(webp({quality: 85}))
    .pipe(dest('dist/img'))
}

// фун-я для js файлов
function scripts() {
  return src('app/js/main.js') // какой файл преобразуем
    .pipe(concat('main.min.js')) // переименованияе + возможность склеивания нескольких файлов в один
    .pipe(uglify()) // сжатие 
    .pipe(dest('app/js')) // куда кидаем
    .pipe(browserSync.stream()) // обновление страницы
}

// функ-я для стилей
function styles() {
  return  src('app/scss/style.scss') // какой файл преобразуем
    .pipe(css({outputStyle: 'compressed'})) // scss в css сжатый
    .pipe(autoprefixer()) // автопрефиксер
    .pipe(concat('style.min.css')) // переименованияе + возможность склеивания нескольких файлов в один
    .pipe(dest('app/css')) // в какую папку кидаем
    .pipe(browserSync.stream()) // обновление страницы
}


// функ-я наблюдения за изменениями файлов
function watching() {
  watch(['app/scss/**/*.scss'], styles); // наблодаем за всеми scss файлами и запускаем функ-ю styles если что-то поменялось там
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts); // наблюдаем за всеми файлами js, кроме main-min.js иначе будет постоянно срабатывать функия scrips
  watch(['app/*.html']).on('change', browserSync.reload); // наблдаем за всеми html файлами и при изменении перезагружаем страницу
}


// функ-я удаления всех папок/файлов в папке dist
function cleanDist() {
  return del('dist');
}

// функ-я сборки проекта 
function build() {
  return src([ // какие файлы нужны
    'app/*.html',
    'app/css/style.min.css',
    'app/fonts/*',
    'app/img/*',
    'app/js/main.min.js'
  ], {base: 'app'}) // структура такая же как и в папке app
  .pipe(dest('dist')) // куда кижаем их всех
}

// экпорт функции 
exports.styles = styles;
exports.images = images;
exports.webpImage = webpImage;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.cleanDist = cleanDist;
exports.build = build;


exports.start = series(cleanDist, images, build, browsersync); // команда для запуска  сборки проекта
exports.default = parallel(styles, scripts, browsersync, watching); // команда для работы над проектом