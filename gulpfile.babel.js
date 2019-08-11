import del from 'del';
import gulp from 'gulp';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import nodemon from 'gulp-nodemon';

const src = './src/**/*.js';
const dst = './lib/';

const lint = () =>
  gulp
    .src(src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());

const compile = () =>
  gulp
    .src(src)
    .pipe(babel())
    .pipe(gulp.dest(dst));

const clean = () => del(dst);
const build = gulp.series(clean, lint, compile);

const start = done => {
  nodemon({
    script: 'lib/index.js',
    watch: 'src',
    ext: 'js',
    done
  });
};

gulp.task('lint', lint);
gulp.task('clean', clean);
gulp.task('start', start);
gulp.task('default', build);
gulp.task('watch', gulp.series(build, start));
