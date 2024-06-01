import path from "path"; // 导入path模块用于文件路径处理
import { Transform } from "stream"; // 导入Transform类用于创建转换流
import chalk from "chalk"; // 导入chalk模块，用于输出彩色文本
import { type TaskFunction, dest, parallel, series, src } from "gulp"; // 从gulp模块导入构建任务相关函数
import gulpSass from "gulp-sass"; // 导入gulp-sass模块用于编译Sass文件
import dartSass from "sass"; // 导入dart-sass模块，作为gulp-sass的编译引擎
import autoprefixer from "gulp-autoprefixer"; // 导入autoprefixer模块，用于自动添加浏览器前缀
import rename from "gulp-rename"; // 导入rename模块，用于重命名文件
import consola from "consola"; // 导入consola模块，用于控制台日志
import postcss from "postcss"; // 导入postcss模块，用于处理CSS
import cssnano from "cssnano"; // 导入cssnano模块，用于压缩CSS

const distFolder = path.resolve(__dirname, "dist"); // 定义最终构建文件的输出目录
const distBundle = path.resolve("../play/src", "theme"); // 定义Element Plus主题包的输出目录

/**
 * 使用 `postcss` 和 `cssnano` 压缩 CSS
 * @returns {Transform} 返回一个转换流
 */
function compressWithCssnano() {
  // 创建一个postcss处理器，用于压缩CSS
  const processor = postcss([
    cssnano({
      preset: [
        "default",
        {
          // 避免颜色转换
          colormin: false,
          // 避免字体转换
          minifyFontValues: false,
        },
      ],
    }),
  ]);
  // 返回一个新的转换流
  return new Transform({
    objectMode: true,
    transform(chunk, _encoding, callback) {
      // 类型断言，将chunk转换为Vinly文件对象
      // const file = chunk as Vinly;
      const file = chunk;
      // 检查文件是否为空
      if (file.isNull()) {
        callback(null, file);
        return;
      }
      // 检查文件是否为流
      if (file.isStream()) {
        callback(new Error("Streaming not supported"));
        return;
      }
      // 读取文件内容
      const cssString = file.contents!.toString();
      // 使用postcss处理器处理CSS
      processor.process(cssString, { from: file.path }).then((result) => {
        // 获取文件名
        const name = path.basename(file.path);
        // 更新文件内容为压缩后的CSS
        file.contents = Buffer.from(result.css);
        // 在控制台输出压缩前后的文件大小
        consola.success(
          `${chalk.cyan(name)}: ${chalk.yellow(cssString.length / 1000)} KB -> ${chalk.green(result.css.length / 1000)} KB`
        );
        callback(null, file);
      });
    },
  });
}

/**
 * 编译 theme-chalk scss 并压缩
 * 不使用 sass.sync().on('error', sass.logError) 来抛出异常
 * @returns {Transform} 返回一个转换流
 */
function buildThemeChalk() {
  // 使用gulp-sass和dart-sass编译Sass文件
  const sass = gulpSass(dartSass);
  // 定义一个正则表达式，用于匹配不需要添加el-前缀的文件名
  const noElPrefixFile = /(index|base|display)/;
  // 读取src目录下的SCSS文件，编译，添加前缀，压缩，重命名（如果需要），并将结果输出到distFolder目录
  return src(path.resolve(__dirname, "src/*.scss"))
    .pipe(sass.sync())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(compressWithCssnano())
    .pipe(
      rename((path) => {
        if (!noElPrefixFile.test(path.basename)) {
          path.basename = `wan-${path.basename}`;
        }
      })
    )
    .pipe(dest(distFolder));
}

/**
 * 构建 dark Css Vars
 * @returns {Transform} 返回一个转换流
 */
function buildDarkCssVars() {
  // 使用gulp-sass和dart-sass编译特定的Sass文件
  const sass = gulpSass(dartSass);
  // 读取src/dark/css-vars.scss文件，编译，添加前缀，压缩，并将结果输出到distFolder/dark目录
  return src(path.resolve(__dirname, "src/dark/css-vars.scss"))
    .pipe(sass.sync())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(compressWithCssnano())
    .pipe(dest(`${distFolder}/dark`));
}

// 创建一个名为'copyIndexCss'的Gulp任务
export function copyIndexCss() {
  // 定义源文件路径，即theme/dist/index.css
  const srcPath = path.join(__dirname, "dist", "index.css");
  // 定义目标路径，即theme
  const destPath = path.join(__dirname);
  return src(srcPath) // 读取源文件
    .pipe(dest(destPath)); // 写入目标路径
}

// 定义并行任务，同时执行copyThemeChalkSource和一系列串行任务（buildThemeChalk，buildDarkCssVars)
export const build: TaskFunction = parallel(
  copyIndexCss,
  series(buildThemeChalk, buildDarkCssVars)
);

// 导出build函数作为模块的默认导出
export default build;
