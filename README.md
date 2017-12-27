# webpack-avalon2-SPA-seed #

## Avalon作者已经不再更新，请更换框架吧

## 项目介绍
本项目是一个参考诸多大神项目，利用webpack整合avalon2.2.4和mmRouter路由的简单项目：
- 整合avalon最新主干代码
- 加入官网路由例子
- 加入(**https://github.com/RubyLouvre/avalon/issues/1815**)中jinwyp大神写的最佳表单验证实践
- 加入es6-promise
- 兼容IE8，请替换lodash版本到3.10.1，该工具插件后面版本不支持IE8
- 加载图片需要用require('图片路径')来引入
- 目前html、js、css、图片可以直接打包出来，但是按需加载css还在解决中

## 尚未解决的问题
- 路由跳转后前个路由页面数据没有统一清除，目前的解决办法是自行一一重置；
- 使用avalon.modern.js时，在grid页面(bb/second)首次加载很慢，相比avalon.js要卡好一会
- 在路由页面dd/four中想触发id为root的顶级controller的方法，但报错TypeError: __vmodel__.getRootFun is not a function(…) "in on dir"，

  在(**http://runjs.cn/code/2ufz7n25**)中单独测试controller嵌套调用方法又是正常的
  
- 升级avalon到"2017-4-19:16:1 version 2.2.5"，页面访问正常；再向上升级从"2017-4-19:17:56 version 2.2.5"版本到

  最新版"2017-5-5:10:30 version 2.2.6"，都有页面卡死、浏览器卡死问题；
  
  thomasyus发现了是ms-view组件的xmp标签的问题，改成wbr或者template就没有这个问题了

  在webpack.config.js的160行可以切换

## 使用说明

- 本项目使用包管理工具NPM，因此需要先把本项目所依赖的包下载下来：
```
$ npm install
```

- 启动服务器
```
$ npm run dev-hrm
```

- 然后请手动打开浏览器，在地址栏里输入`http://localhost:10086`，Duang！页面就出来了！

- 如果是端口号问题，请直接在package.json中修改所想要的端口号即可

- 如果想改变avalon引入（avalon.js替换为avalon.modern.js），请在webpack.config.js的159行处理

## CLI命令(npm scripts)
| 命令            | 作用&效果          |
| --------------- | ------------- |
| npm run clean-build     | 清空build代码 |
| npm run clean-node_modules     | 清空项目依赖 |
| npm run build     | 执行清空操作并build出一份生产环境的代码 |
| npm run build-dev     | 执行清空操作并build出一份开发环境的代码 |
| npm run dev-hrm   | 执行清空操作并运行项目（热更新） |

## 目录结构说明
```
├─dist # 编译后生成的所有代码、资源（虽然只是简单的从源目录迁移过来）
├─node_modules # 利用npm管理的所有包及其依赖
├─libs # 所有不能用npm管理的第三方库
├─package.json # npm的配置文件
├─webpack.config.js # 开发环境的webpack配置文件
├─npm-scripts # 开发环境的webpack辅助配置文件（包含清空dist和node_modules目录的配置文件）
└─src # 当前项目的源码
    ├─components # avalon组件存放地（只能有js）
    ├─html # 各个页面独有的部分（只有该页面的html）
    │  ├─aa # 业务模块
    │  │  └─first.html # 具体页面
    │  ├─bb # 业务模块
    │  │  ├─second.html # 具体页面
    │  └─cc # 业务模块
    │      ├─third.html # 具体页面
    ├─js # 各个页面独有的部分（入口js文件）
    │  ├─aa # 业务模块
    │  │  └─first.js # 具体js
    │  ├─bb # 业务模块
    │  │  ├─second.js # 具体js
    │  └─cc # 业务模块
    │      ├─third.js # 具体js
    ├─index.html # 单页面应用主页（模版）
    └─index.js # 单页面应用入口js文件（包括路由设置）
```

