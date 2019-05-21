'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const cleancss = require('gulp-clean-css');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const ghPages = require('gulp-gh-pages');
// const bSync = require('browser-sync');
// const imageResize = require('gulp-image-resize');
const rigger = require('gulp-rigger');

// gulp.task('serve', function () {
//     bSync({
//         server: './build',
//         open: false
//         // tunnel: true,
//     });
//     gulp.watch('./build/**/*.*').on('change', bSync.reload);
// });

gulp.task('html', function () {
    return gulp.src('./src/index.html')
        .pipe(rigger())
        .pipe(gulp.dest('./dist'))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./build'))
});

gulp.task('img', function () {
    return gulp.src('./src/**/*{png,gif,jpg}')
        .pipe(rename((path) => path.dirname = ""))
        .pipe(gulp.dest('./build/img'))
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('sass', function () {
    return gulp.src('./src/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat('style.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist'))
        .pipe(cleancss())
        .pipe(gulp.dest('./build'))
});

gulp.task('js', function () {
    return gulp.src('./src/**/*.js')
        // .pipe(sourcemaps.init())
        .pipe(concat('script.js'))
        .pipe(babel({ presets: ['@babel/env'] }))
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist'))
        .pipe(uglify())
        .pipe(gulp.dest('./build'));
});

gulp.task('watch', function () {
    gulp.watch('./src/**/*.scss', gulp.series('sass'));
    gulp.watch('./src/**/*.html', gulp.series('html'));
    gulp.watch('./src/**/*.js', gulp.series('js'));
    gulp.watch('./src/**/*.{png,gif,jpg}', gulp.series('img'));
});

gulp.task('gh-pages', function () {
    return gulp.src('./build/**/*')
        .pipe(ghPages());
});

gulp.task('build', gulp.parallel('html', 'sass', 'js', 'img'));

gulp.task('default', gulp.series('build', gulp.parallel('watch')));
