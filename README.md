# webpack-avalon2-SPA-seed #

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

## CLI命令(npm scripts)
| 命令            | 作用&效果          |
| --------------- | ------------- |
| npm run clean-build     | 清空build代码 |
| npm run clean-node_modules     | 清空项目依赖 |
| npm run build     | 执行清空操作，然后build出一份生产环境的代码 |
| npm run build-dev     | 执行清空操作，然后build出一份开发环境的代码 |
| npm run dev-hrm   | 执行清空操作，然后运行项目（热更新） |

