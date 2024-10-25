const gulp = require('gulp')
// const print = require('gulp-print').default

gulp.task('test', async (args) => {
  console.debug(args)
  console.log('gulp test > success')
})

gulp.task('clone', () => {
  return gulp
    .src(['./**', '!./.git', '!./build'], {
      dot: true,
    })
    .pipe(gulp.dest('../NODE-STARTER-COPY'))
})
