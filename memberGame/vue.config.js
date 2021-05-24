const path = require("path");
const webpack = require("webpack");
const buildDate = JSON.stringify(new Date().toLocaleString());
// const CompressionWebpackPlugin = require('compression-webpack-plugin'); // 开启gzip压缩， 按需引用
// const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i; // 开启gzip压缩， 按需写入
const vConsolePlugin = require("vconsole-webpack-plugin");
const sh = require("./.sh");

//返回路径
function resolve(dir) {
  // console.log(path.join(__dirname, dir));
  return path.join(__dirname, dir);
}

// eslint-disable-next-line
const isProd = process.env.NODE_ENV === "production";
const ENV = process.env.ENV;

//游戏中心
const times = process.env.VUE_APP_BASE_API;

//中科服务商域名配置
// const zkHost = "http://39.105.84.126:28816"; //中科dev环境
// const zkHost = "https://mall-uat-api-linli.timesgroup.cn"; //中科uat环境
const zkHost = process.env.VUE_APP_API; //中科dev环境

// const assetsCDN = {
//   // webpack build externals
//   externals: {
//     vue: 'Vue',
//     'vue-router': 'VueRouter',
//     Antd: 'ant-design-vue',
//     vuex: 'Vuex',
//     axios: 'axios'
//   },
//   css: [],
//   // https://unpkg.com/browse/vue@2.6.10/
//   js: [
//     '//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
//     '//cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js',
//     '//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
//     '//cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js'
//   ]
// };

// vue.config.js
const vueConfig = {
  // 默认'/'，部署应用包时的基本 URL
  publicPath: ENV !== "test" ? "./" : "/",
  outputDir: "dist",
  assetsDir: "static",
  configureWebpack: config => {
    config.plugins = [
      ...config.plugins,
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.DefinePlugin({
        APP_VERSION: `"${require("./package.json").version}"`,
        BUILD_DATE: buildDate
      })
      // new CompressionWebpackPlugin({
      //   filename: '[path].gz[query]',
      //   algorithm: 'gzip',
      //   test: productionGzipExtensions,
      //   threshold: 100,
      //   minRatio: 0.8
      // })
    ];
    //灰度环境
    if (ENV == "staging") {
      config.plugins = [
        ...config.plugins,
        new vConsolePlugin({
          filter: [], // 需要过滤的入口文件
          enable: true // 发布代码前记得改回 false
        })
      ];
    }
    //正式环境
    // if (ENV == "production") {
    //   //替换nginx配置文件
    //   sh.replace({
    //     file: "/deploy/",
    //     newfile: "/deploy-prod/*"
    //   });
    // } else {
    //   //替换nginx配置文件
    //   sh.replace({
    //     file: "/deploy/",
    //     newfile: "/deploy-uat/*"
    //   });
    // }
    // if prod, add externals
    // externals: isProd ? assetsCDN.externals : {}
  },
  chainWebpack: config => {
    // 移除prefetch插件，避免加载多余的资源
    config.plugins.delete("prefetch");
    // 压缩图片
    const imagesRule = config.module.rule("images");
    imagesRule.uses.clear();
    imagesRule
      .use("file-loader")
      .loader("url-loader")
      .options({
        limit: 10240,
        fallback: {
          loader: "file-loader",
          options: {
            outputPath: "static/images"
          }
        }
      });

    // 压缩响应的app.json返回的代码压缩
    config.optimization.minimize(true);

    config.resolve.alias
      .set("@$", resolve("src"))
      .set("@assets", resolve("src/assets"))
      .set("@request", resolve("src/api/request/apiAddress"));

    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule
      .oneOf("inline")
      .resourceQuery(/inline/)
      .use("vue-svg-icon-loader")
      .loader("vue-svg-icon-loader")
      .end()
      .end()
      .oneOf("external")
      .use("file-loader")
      .loader("file-loader")
      .options({
        name: "assets/[name].[hash:8].[ext]"
      });

    // if prod is on
    // assets require on cdn
    // if (isProd) {
    //   config.plugin('html').tap(args => {
    //     args[0].cdn = assetsCDN
    //     return args
    //   })
    // }
  },

  // css: {
  //   loaderOptions: {
  //     less: {
  //       lessOptions: {
  //         modifyVars: {
  //           'primary-color': '#4B7AFB',
  //           'layout-trigger-background': '#3A3F48',
  //           'menu-dark-submenu-bg': '#303e51',
  //           'layout-header-background': '#414751',
  //           'link-color': '#4B7AFB',
  //           'border-radius-base': '2px'
  //         },
  //         javascriptEnabled: true
  //       }
  //     }
  //   }
  // },

  devServer: {
    // open: true, // 是否自动打开浏览器页面
    // development server port 8080
    port: 8082,
    // port: 80,
    // host:'mall-uat-app-linli.timesgroup.cn',
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    proxy: {
      //tsm
      "/times/": {
        target: times,
        changeOrigin: true
      }
    }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: undefined
  // babel-loader no-ignore node_modules/*
  // transpileDependencies: [
  //   "@zkty-team/x-engine-module-device",
  //   "@zkty-team/x-engine-module-engine",
  //   "@zkty-team/x-engine-module-localstorage",
  //   "@zkty-team/x-engine-module-nav",
  //   "@zkty-team/x-engine-module-router",
  //   "@zkty-team/x-engine-module-ui"
  // ]
};

module.exports = vueConfig;

// console.log("process.env.NODE_ENV :>> ", process.env.NODE_ENV); //打印环境变量
