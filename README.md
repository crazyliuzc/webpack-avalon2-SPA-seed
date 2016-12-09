# webpack-avalon2-SPA-seed #

## 项目介绍
本项目是一个参考诸多大神项目，利用webpack整合avalon2.2.2的简单项目：
- 整合avalon最新主干代码
- 加入官网路由例子（目前问题还存在不少，使用avalon.js路由跳转成功，但是第二次切换至grid页时翻页报错；
  使用avalon.modern.js路由报错）
- 加入https://github.com/RubyLouvre/avalon/issues/1815中jinwyp大神写的最佳表单验证实践（使用avalon.modern.js报错）
- 目前html、js、css可以直接打包出来，但是整合图片和按需加载css还在解决中


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

- 如果想改变avalon引入，请在webpack.config.js的159行处理

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
├─src # 当前项目的源码
    ├─components # avalon组件存放地（只能有js）
    ├─html # 各个页面独有的部分（只有该页面的html）
    │  ├─aa # 业务模块
    │  │  └─first.html # 具体页面
    │  ├─bb # 业务模块
    │  │  ├─second.html # 具体页面
    │  └─cc # 业务模块
    │      ├─third.html # 具体页面
    └─js # 各个页面独有的部分（入口js文件）
    │  ├─aa # 业务模块
    │  │  └─first.js # 具体js
    │  ├─bb # 业务模块
    │  │  ├─second.js # 具体js
    │  └─cc # 业务模块
    │      ├─third.js # 具体js
    └─index.html # 单页面应用主页
    └─index.js # 单页面应用入口js文件（包括路由设置）
```

