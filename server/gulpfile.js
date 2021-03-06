var gulp = require("gulp");
var ts = require("gulp-typescript");
var sourcemaps = require('gulp-sourcemaps');
var tsProject = ts.createProject("tsconfig.json",{
    typescript: require('typescript')
});

// gulp.task("build", function () {
//     gulp.src('process.yml')
//         .pipe(gulp.dest('dist'));
//
//     return tsProject.src()
//         .pipe(sourcemaps.init())
//         .pipe(tsProject())
//         .js
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest('dist'));
// });

// gulp.task('watchTask', function () {
//     gulp.watch('./**/*.ts', ['build']);
// });

gulp.task('build', function() {
    gulp.src('process.yml')
        .pipe(gulp.dest('dist'));

    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'));
});

gulp.task("default", ['build']);
// gulp.task("watch", ['build', 'watchTask']);