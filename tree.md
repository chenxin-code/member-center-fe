## 项目图谱

├── README.md // README 使用说明
├── babel.config.js // 1.babel预设环境 2.生产环境移除console
├── config
│   └── theme.plugin.js // ant design vue 官方颜色主题配置
├── package.json // 1.生产依赖和开发依赖 2.npm运行命令
├── patches
│   └── ant-design-vue+1.7.2.patch // ant design vue 列表组件输入跳转bug
├── public
│   ├── favicon.ico // 网站图标
│   └── index.html //模版文件
├── src
│   ├── App.vue // 根组件
│   ├── antd //ant design vue 官方组件库
│   │   └── components
│   ├── api // 项目api集合
│   │   ├── access.js // 各个模块对应的方法
│   │   ├── card.js // 各个模块对应的方法
│   │   ├── dealing.js // 各个模块对应的方法
│   │   ├── index.js // api出口
│   │   ├── login.js // 各个模块对应的方法
│   │   ├── member.js // 各个模块对应的方法
│   │   ├── release.js // 各个模块对应的方法
│   │   ├── task.js // 各个模块对应的方法
│   │   └── urlConfig.js // axios请求url集合
│   ├── assets
│   │   ├── css // 全局和通用样式
│   │   │   ├── common.less
│   │   │   └── global.less
│   │   ├── img // 图片
│   │   └── json // json死数据
│   │       ├── addService.json
│   │       ├── bank.json
│   │       ├── country.json
│   │       ├── interest.json
│   │       ├── provinces.json
│   │       └── vehicleBrand.json
│   ├── components // 项目组件
│   │   ├── FilterGroup // 表头组件1
│   │   │   └── index.jsx
│   │   ├── FormList // 表头组件1
│   │   │   └── index.jsx
│   │   ├── FromSecond
│   │   │   └── FromSecond.jsx
│   │   ├── InspectionStandard
│   │   │   └── index.vue
│   │   ├── ShuttleBox
│   │   │   ├── ShuttleBox.vue
│   │   │   └── ShuttleHead.vue
│   │   ├── breadcrumb
│   │   │   └── index.vue
│   │   ├── home.vue // 首页组件
│   │   ├── menu //菜单组件
│   │   │   └── index.vue
│   │   ├── richTextLike
│   │   │   └── index.vue
│   │   ├── transfer
│   │   │   └── index.vue
│   │   ├── uploadImage
│   │   │   ├── UpLoadImg.vue
│   │   │   └── index.vue
│   │   └── vtables
│   │       ├── index.jsx
│   │       └── index.vue
│   ├── config // 菜单配置文件，看不懂可参考ant design vue pro官网
│   │   └── menu.js
│   ├── constance //常量集合
│   │   └── index.js
│   ├── main.js // 项目入口文件
│   ├── pages // 各个模块页面
│   │   ├── accessManager
│   │   │   ├── detail.vue
│   │   │   └── index.vue
│   │   ├── actJoin
│   │   │   └── list.vue
│   │   ├── actManage
│   │   │   ├── detail.vue
│   │   │   ├── edit.vue
│   │   │   ├── list.vue
│   │   │   └── new.vue
│   │   ├── actTheme
│   │   │   ├── add-edit.vue
│   │   │   └── list.vue
│   │   ├── card
│   │   │   ├── detail.vue
│   │   │   └── index.vue
│   │   ├── coupons
│   │   │   ├── cancel
│   │   │   │   └── list.vue
│   │   │   ├── claim
│   │   │   │   └── list.vue
│   │   │   ├── manage
│   │   │   │   ├── copy.vue
│   │   │   │   ├── detail.vue
│   │   │   │   ├── edit.vue
│   │   │   │   ├── list.vue
│   │   │   │   └── new.vue
│   │   │   └── release
│   │   │       ├── create.vue
│   │   │       ├── createForms.js
│   │   │       ├── detail.vue
│   │   │       ├── index.vue
│   │   │       └── status.vue
│   │   ├── dealingManager
│   │   │   ├── detail.vue
│   │   │   └── index.vue
│   │   ├── exception
│   │   │   ├── 403.vue
│   │   │   ├── 404.vue
│   │   │   └── 500.vue
│   │   ├── member
│   │   │   ├── dashboard
│   │   │   │   └── index.vue
│   │   │   ├── info
│   │   │   │   ├── detail.vue
│   │   │   │   └── list.vue
│   │   │   └── integral
│   │   │       └── list.vue
│   │   └── taskManager
│   │       ├── detail.vue
│   │       └── index.vue
│   ├── router // 路由文件
│   │   ├── ParamsStorage.js //数据持久化方法(sessionStorage)
│   │   └── index.js  // 路由表+路由全局守卫
│   ├── store //vuex状态管理
│   │   ├── app-mixin.js //不用管
│   │   ├── index.js //vuex出口
│   │   ├── module //vuex模块
│   │   │   ├── app.js //不用管
│   │   │   ├── menu.js //暂时用不到
│   │   │   └── user.js //用户状态
│   │   └── mutation-types.js //不用管
│   └── utils // 函数工具类
│       ├── ajax.js //axios二次封装
│       ├── authority.js // 权限控制主要在home和menu组件里面
│       ├── filter.js // 全局过滤器
│       ├── lazy_use.js //不用管
│       └── util.js // 工具函数
├── vue.config.js // webpack自定义配置文件
