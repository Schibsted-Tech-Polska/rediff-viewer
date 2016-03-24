var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var paths = {
    scripts: [
        './lib/*.js',
        './public/js/*.js',
        './public/collections/**/*.js',
        './public/models/**/*.js',
        './public/utils/**/*.js',
        './public/views/**/*.js',
        '!./public/js/bootstrap.min.js',
        '!./public/js/almond.js'
    ],
    styles: {
        src: './scss/',
        dst: './public/css/'
    }
};

gulp.task('css', function() {
    gulp.src(paths.styles.src + '**/*.scss')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass({outputStyle: 'compressed'}))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(paths.styles.dst));
});

gulp.task('js', function() {
    return gulp.src('./public/js/almond.js')
        .pipe($.requirejsOptimize({
            enforceDefine: true,
            name: 'almond',
            include: ['bootstrap'],
            insertRequire: ['bootstrap'],
            mainConfigFile: './public/js/bootstrap.js',
            optimize: 'none',
            paths: {
                'text': 'vendor/requirejs/text',
                'templates': '../templates'
            },
            out: "bootstrap.min.js"
        }))
        .pipe(gulp.dest('public/js'));
});

gulp.task('watch', function() {
    gulp.watch(paths.styles.src + '**/*.scss', ['css']);
});

gulp.task('build', ['css']);

gulp.task('default', ['build']);
