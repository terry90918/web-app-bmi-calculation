const gulp = require('gulp');
const pug = require('gulp-pug');
const scss = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const minifyCss = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const connect = require('gulp-connect');
const plumber = require('gulp-plumber');

const dirs = {
	src: 'src',
	dest: 'dist'
};

const pugPaths = {
	src: `${dirs.src}/**/*.pug`,
	dest: `${dirs.dest}/`
};

const stylesPaths = {
	src: `${dirs.src}/styles/*.scss`,
	dest: `${dirs.dest}/css`
};

const scriptsPaths = {
	src: `${dirs.src}/scripts/*.js`,
	dest: `${dirs.dest}/js`
};

const imagesPaths = {
	src: `${dirs.src}/images/**/*`,
	dest: `${dirs.dest}/img`
};

// 複製 HTML
gulp.task('copyHTML', () => {
	return gulp.src('./src/**/*.html')
		.pipe(gulp.dest('./dist/'));
});

// 編譯 Pug 任務，完成後送到 dist/*.html
gulp.task('pug', () => {
	return gulp.src(pugPaths.src)
		.pipe(plumber())
		.pipe(pug({
			pretty: false // true: 不壓縮, false: 壓縮
		}))
		.pipe(gulp.dest(pugPaths.dest))
		.pipe(connect.reload());
});

// 編譯 Scss 任務，完成後送到 dist/css/main.css
gulp.task('styles', () => {
	var plugins = [
		autoprefixer({browsers: ['last 1 version']})
	];
	
	return gulp.src(stylesPaths.src)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(scss().on('error', scss.logError))
		.pipe(postcss(plugins))
		.pipe(minifyCss())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(stylesPaths.dest))
		.pipe(connect.reload());
});

// 編譯 JavaScript 轉譯、合併、壓縮任務，完成後送到 dist/js/bundle.js
gulp.task('scripts', () => {
	return gulp.src(scriptsPaths.src)
		.pipe(sourcemaps.init())
		.pipe(babel({ // 轉譯
			presets: ['es2015']
		}))
		.pipe(uglify({ // 醜化
			compress: {
				drop_console: false // true: 移除 console, false: 顯示 console
			}
		}))
		// 重新命名 與 合併 選一
		.pipe(rename((path) => { // 重新命名
			path.basename += ".min";
			path.extname = ".js";
		}))
		// .pipe(concat('all.min.js')) // 合併
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(scriptsPaths.dest))
		.pipe(connect.reload());
});

// 複製 images 任務，完成後送到 dist/img
gulp.task('images', () => {
	return gulp.src(imagesPaths.src)
		.pipe(plumber())
		.pipe(imagemin())
		.pipe(gulp.dest(imagesPaths.dest));
});

// 啟動測試用 server，root 為 index.html 放置位置
gulp.task('server', () => {
	connect.server({
		root: ['./dist/'],
		livereload: true,
		port: 7777,
	});
});

// 監聽是否有檔案更新
gulp.task('watch', () => {
	gulp.watch(pugPaths.src, ['pug']);
	gulp.watch(stylesPaths.src, ['styles']);
	gulp.watch(scriptsPaths.src, ['scripts']);
});

// 預設模式
gulp.task('default', ['pug', 'styles', 'scripts', 'server', 'watch']);
// 建構模式
gulp.task('build', ['pug', 'scripts', 'styles', 'images']);