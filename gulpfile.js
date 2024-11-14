const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const ghPages = require("gulp-gh-pages");

const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const server = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");
const webpackStream = require("webpack-stream");
const webpackConfig = require("./webpack.config.js");
const gcmq = require("gulp-group-css-media-queries");

const css = () => {
  return gulp
    .src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(
      postcss([
        autoprefixer({
          grid: true,
          flexbox: true,
          overrideBrowserslist: ["last 2 versions", "> 1%", "ie 11"],
        }),
      ])
    )
    .pipe(gcmq())
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
};

const js = () => {
  return gulp
    .src(["source/js/main.js"])
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest("build/js"));
};

const svgo = () => {
  return gulp
    .src("source/img/**/*.{svg}")
    .pipe(
      imagemin([
        imagemin.svgo({
          plugins: [
            { removeViewBox: false },
            { removeRasterImages: true },
            { removeUselessStrokeAndFill: false },
          ],
        }),
      ])
    )
    .pipe(gulp.dest("source/img"));
};

const sprite = () => {
  return gulp
    .src("source/img/svg/*.svg")
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename("sprite_auto.svg"))
    .pipe(gulp.dest("build/img/sprite"));
};

const copyFonts = () => {
  return gulp
    .src("source/fonts/**/*.{woff,woff2,ttf,otf}", { encoding: false })
    .pipe(gulp.dest("build/fonts"));
};

const copySvg = () => {
  return gulp
    .src("source/img/svg/**/*.svg", { base: "source" })
    .pipe(gulp.dest("build/"));
};

const copyImages = () => {
  return gulp
    .src("source/img/**/*.{png,jpg}", { base: "source", encoding: false })
    .pipe(gulp.dest("build"));
};

const copy = () => {
  return gulp
    .src(["source/**.html"], {
      base: "source",
    })
    .pipe(gulp.dest("build"));
};

const clean = () => {
  return del("build");
};

const syncServer = () => {
  server.init({
    server: "build/",
    index: "index.html",
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch("source/**.html", gulp.series(copy, refresh));
  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series(css));
  gulp.watch("source/js/**/*.{js,json}", gulp.series(js, refresh));
  gulp.watch("source/data/**/*.{js,json}", gulp.series(copy, refresh));
  gulp.watch("source/img/**/*.svg", gulp.series(copySvg, sprite, refresh));
  gulp.watch(
    "source/img/**/*.{png,jpg,webp}",
    gulp.series(copyImages, refresh)
  );

  gulp.watch("source/favicon/**", gulp.series(copy, refresh));
  gulp.watch("source/video/**", gulp.series(copy, refresh));
  gulp.watch("source/downloads/**", gulp.series(copy, refresh));
  gulp.watch("source/*.php", gulp.series(copy, refresh));
};

const refresh = (done) => {
  server.reload();
  done();
};

const createWebp = () => {
  const root = "";
  return gulp
    .src(`source/img/${root}**/*.{png,jpg}`, { encoding: false })
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest(`build/img/${root}`));
};

const optimizeImages = () => {
  return gulp
    .src("build/img/**/*.{png,jpg}", { encoding: false })
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
      ])
    )
    .pipe(gulp.dest("build/img"));
};
const build = gulp.series(
  clean,
  svgo,
  copy,
  css,
  js,
  copyImages,
  copySvg,
  copyFonts,
  sprite,
  createWebp,
  optimizeImages
);
const start = gulp.series(syncServer);

exports.imagemin = gulp.series(optimizeImages);
exports.webp = createWebp;
exports.start = start;
exports.build = build;

const deploy = () => {
  return gulp.src("build/**/*", { encoding: false }).pipe(ghPages());
};

exports.deploy = deploy;
