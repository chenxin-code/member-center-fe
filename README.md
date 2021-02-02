# snx-webbv

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

###包结构

```
|——public
|	|——favicon.ico          # logo
|	|——index.html           # 入口模板
|——src
|	|——api                  # api
|	|——assets               # 本地静态资源
|	|——components           # 业务通用组件
|	|——config               # 项目基础配置,包含menu、portal
|	|——constance            # 全部变量配置
|	|——pages                # 业务页面
|	|——router               # Vue-Router
|	|——store                # Vuex
|	|——utils                # 工具库
|	|——App.vue              # Vue模板入口
|	|——main.js              # Vue入口js

```

### 新页面

- 需要在目录下建立文件夹，命名为小写，如需分词使用驼峰 ，如 “addSpace”
- 文件夹下至少需要 1 个文件

```
|-- page
|	|-- index.vue // 页面
```

### 全局 css

```
|—src
|	|—assets
|   |	|—css
|   |	|	|—common.less
```

### api 定义

```
|—api
|	|—模块.js              配置当前模块ajax
|	|—index.js            引入模块.js
|	|—urlConfig.js        配置api
```

### ant-design-vue table pagination blur bug

path: node_modules/ant-design-vue/es/vc-pagination/Options.js

```javascript
handleBlur: function handleBlur(e) {
  //FIXME: blur bug
  var goInputText = this.goInputText;
  if (goInputText === '') {
    return;
  }
  //FIXME: blur bug

  var _$props = this.$props,
    goButton = _$props.goButton,
    quickGo = _$props.quickGo,
    rootPrefixCls = _$props.rootPrefixCls;

  if (goButton) {
    return;
  }
  if (
    e.relatedTarget &&
    (e.relatedTarget.className.indexOf(rootPrefixCls + '-prev') >= 0 ||
      e.relatedTarget.className.indexOf(rootPrefixCls + '-next') >= 0)
  ) {
    return;
  }
  quickGo(this.getValidValue());
  //FIXME: blur bug
  this.setState({
    goInputText: ''
  });
  //FIXME: blur bug
}
```
