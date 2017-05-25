var path = require('path');

var glob = require('glob');

var pkg=require("./package.json");

var webpack = require('webpack');

/*
 * verify config
 * （验证config文件是否正确）
 * */
//var validate = require('webpack-validator');

/*
 * clean publishing directory
 * （清空发布目录）
 * */
// var CleanWebpackPlugin = require('clean-webpack-plugin');

/*
 * create html
 * （创建html文件）
 * */
var HtmlWebpackPlugin = require('html-webpack-plugin');


/*
 * extract css
 * （提取css文件）
 * */
var ExtractTextPlugin = require("extract-text-webpack-plugin");


/*
 *  merge config
 *  （合并config文件）
 * */
var Merge = require('webpack-merge');

/*
 * auto open browser
 * （自动打开浏览器）
 * */
//var OpenBrowserPlugin = require('open-browser-webpack-plugin');

/*
 *  Detect how npm is run and branch based on that
 *  （当前 npm 运行）
 * */
var currentTarget = process.env.npm_lifecycle_event;

var debug,          // is debug
    devServer,      // is hrm mode
    minimize;       // is minimize


if (currentTarget == "build") { // online mode （线上模式）

    debug = false, devServer = false, minimize = false;

} else if (currentTarget == "build-dev") { // dev mode （开发模式）

    debug = true, devServer = false, minimize = false;

} else if (currentTarget == "dev-hrm") { // dev HRM mode （热更新模式）

    debug = true, devServer = true, minimize = false;
}

/**
 * 获得路径
 * @param globPath: str
 * @param pathDir: str 对比路径
 * @returns {{}}
 */
function getEntry(globPath, pathDir) {
    var files = glob.sync(globPath);
    var entries = {},
        entry, dirname, basename, pathname, extname;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        extname = path.extname(entry);
        basename = path.basename(entry, extname);
        pathname = path.normalize(path.join(dirname,  basename));
        pathDir = path.normalize(pathDir);
        if(pathname.startsWith(pathDir)){
            pathname = pathname.substring(pathDir.length)
        }
        entries[pathname] = ['./' + entry];
    }
    return entries;
}

//获取 html 多模块入口文件
var file_css = getEntry('./src/css/**/*.?(css|scss)', './src/css/');
var file_components = getEntry('./src/components/**/*.?(js|html)', './src/components/');
var file_js = getEntry('./src/js/**/*.js', './src/js/');
var file_html = getEntry('./src/html/**/*.html', './src/html/');
var pages = Object.keys(file_html);

var PATHS = {
    /*
     * publish path
     * （发布目录）
     * */
    publicPath: devServer ? '/webpack-avalon2-SPA-seed/dist/' : './',


    /*
     * public resource path
     * （公共资源目录）
     * */
    libsPath: path.resolve(process.cwd(), './libs'),


    /*
     * resource path
     * （src 目录）
     * */
    srcPath: path.resolve(process.cwd(), 'src'),


    /*
    * node_modules path
    */
    node_modulesPath: path.resolve('./node_modules')
};


var resolve = {
    /*
     * An array of extensions that should be used to resolve modules
     * （引用时可以忽略后缀）
     * */
    extensions: ['', '.js', '.css', '.scss', '.ejs', '.png', '.jpg'],


    /*
     * The directory (absolute path) that contains your modules
     * */
    root: [
        PATHS.node_modulesPath
    ],


    /*
     * Replace modules with other modules or paths.
     * （别名，引用时直接可以通过别名引用）
     * */
    alias: {
        /*
         * js
         */
        jquery: path.join(PATHS.libsPath, "js/jquery/jquery.js"),
        // avalon2: path.join(PATHS.libsPath, "js/avalon/avalon.modern.js"),
        // avalon2: path.join(PATHS.libsPath, "js/avalon/avalon2.2.7.js"),
        avalon2: path.join(PATHS.libsPath, "js/avalon/avalon2.2.5.js"),
        mmRouter: path.join(PATHS.libsPath, "js/avalon/mmRouter.js"),
        lodash: path.join(PATHS.libsPath, "js/lodash.min.js"),

        /*
         * components
         */
        heredoc: path.join(PATHS.srcPath, "components/heredoc.js"),
        pagination: path.join(PATHS.srcPath, "components/pagination.js"),


        /*
         * css
         */
        // bootstrapcss: path.join(PATHS.libsPath, "css/bootstrap/bootstrap-3.3.5.css"),
        // indexcss: path.join(PATHS.srcPath, "css/index.css")
    }
};

/*
 * The entry point for the bundle.
 * （入口）
 * */
var entry = Object.assign(file_js,file_components, {
    // 路由入口
    index: ['./src/index.js'],
    // 用到什么公共lib（例如jquery.js），就把它加进common去，目的是将公用库单独提取打包
    common: [
        'jquery','avalon2','lodash','mmRouter'
    ]
});


/*
 * output options tell Webpack how to write the compiled files to disk
 * （webpack 编译后输出标识）
 * */
var output = {
    /*
     *  determines the location on disk the files are written to
     *  （输出目录）
     * */
    path: path.join(__dirname, 'dist'),

    /*
     * The publicPath specifies the public URL address of the output files when referenced in a browser
     * （发布后，资源的引用目录）
     * */
    publicPath: "",

    /*
     * Specifies the name of each output file on disk
     * （文件名称）
     * */
    filename: devServer ? 'js/[name].js' : 'js/[name]-[chunkhash:8].js',

    /*
     * The filename of non-entry chunks as relative path inside the output.path directory.
     * （按需加载模块时输出的文件名称）
     * */
    // chunkFilename: devServer ? 'js/[name].js' : 'js/[name]-[chunkhash:8].js'
}

var loaders = [

    /*
     * Exports HTML as string, require references to static resources.
     * （html loader）
     * */
    {
        test: /\.html$/,
        loader: "html"
        // loader: "html?-minimize"
    },


    /*
     * img loader
     * */
    {
        test: /\.(png|gif|jpe?g)$/,
        loader: 'url-loader',
        query: {
            /*
             *  limit=10000 ： 10kb
             *  图片大小小于10kb 采用内联的形式，否则输出图片
             * */
            limit: 10000,
            name: '/img/[name]-[hash:8].[ext]'
        }
    },


    /*
     * font loader
     * */
    {
        test: /\.(eot|woff|woff2|ttf|svg)$/,
        loader: 'url-loader',
        query: {
            limit: 5000,
            name: '/font/[name]-[hash:8].[ext]'
        }
    },


    /*
     * Extract css files
     * （提取css到单独文件loader）
     */
    {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader", {
            publicPath: '../'
        })
    }

];

var plugins = [

    /*
     * gloabal flag
     * （全局标识）
     * */
    new webpack.DefinePlugin({
        /*
         * dev flag
         * （开发标识）
         * */
        __DEV__: debug,

        /*
         * proxy flag
         * （代理的标识）
         * */
        __DEVAPI__: devServer ? "/devApi/" : "''"
    }),

    /*
     * common js
     * （公共js）
     * */
    new webpack.optimize.CommonsChunkPlugin(
        devServer ?
        {name: "common", filename: "js/common.js"}:
        {names: ["common", "webpackAssets"]}
    ),

    /*
     *  Module (value) is loaded when the identifier (key) is used as free variable in a module
     *  （如：使用jquery 可以直接使用符号 "$"）
     * */
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
        "avalon": "avalon2",
        "window.avalon": "avalon2",
        "_": "lodash"
    }),


    /*
     * Search for equal or similar files and deduplicate them in the output
     * （删除重复依赖的文件）
     */
    new webpack.optimize.DedupePlugin(),


    /*
     * Using this config the vendor chunk should not be changing its hash unless you change its code or dependencies
     * （避免在文件不改变的情况下hash值不变化）
     * */
    new webpack.optimize.OccurenceOrderPlugin(),


    /*
     * clean publishing directory
     * （发布前清空发布目录）
     * */
    /*new CleanWebpackPlugin(['dist'], {
        root: '', // An absolute path for the root  of webpack.config.js
        verbose: true,// Write logs to console.
        dry: false // Do not delete anything, good for testing.
    }),*/


    /*
     * extract css
     * （提取css文件到单独的文件中）
     */
    new ExtractTextPlugin(devServer ? "css/[name].css" : "css/[name]-[chunkhash:8].css", {allChunks: true}),


    /*
     *create html file
     * （创建html文件）
     * */
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: __dirname + '/src/index.html',
        /*
         * inject: true | 'head' | 'body' | false Inject all assets into the given template or templateContent -
         * When passing true or 'body' all javascript resources will be placed at the bottom of the body element.
         * 'head' will place the scripts in the head element.
         * */
        inject: 'body',

        // 需要依赖的模块
        chunks: ['common', 'index', 'webpackAssets'],

        // 根据依赖自动排序
        chunksSortMode: 'dependency'
    })
];

//html 模板插件
pages.forEach(function(pathname) {
    var conf = {
        filename: 'html/' + pathname + '.html', //生成的html存放路径，相对于path
        template: path.resolve(__dirname, './src/html/' + pathname + '.html'), //html模板路径
        inject: false
        /*
         * 压缩这块，调用了html-minify，会导致压缩时候的很多html语法检查问题，
         * 如在html标签属性上使用{{...}}表达式，很多情况下并不需要在此配置压缩项，
         * 另外，UglifyJsPlugin会在压缩代码的时候连同html一起压缩。
         * 为避免压缩html，需要在html-loader上配置'html?-minimize'，见loaders中html-loader的配置。
         */
        /* minify: { //压缩HTML文件
         removeComments: true, //移除HTML中的注释
         collapseWhitespace: false //删除空白符与换行符
         }*/
    };
    plugins.push(new HtmlWebpackPlugin(conf));
});

if (minimize) {

    plugins.push(
        /*
         * Uglify
         * （压缩）
         * */
        new webpack.optimize.UglifyJsPlugin({ // js、css都会压缩
            mangle: {
                except: ['$super', '$', 'exports', 'require', 'module', '_']
            },
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        })
    )

}


var config = {
    entry: entry,
    /*
     *  Like resolve but for loaders.
     *  （查找loader 的位置）
     * */
    resolveLoader: {root: path.join(__dirname, "node_modules")},
    output: output,
    module: {
        loaders: loaders
    },
    resolve: resolve,
    plugins: plugins

};


/*
 *  Hrm setting
 * （开启热更新，并自动打开浏览器）
 * */
if (devServer) {

    var webpackHot='webpack/hot/dev-server';
    var webpackClient='webpack-dev-server/client?http://'+pkg.config.devHost+':'+pkg.config.devPort;

    /*pages.forEach(function (e) {
        file_css[e].unshift(webpackClient,webpackHot);
        file_html[e].unshift(webpackClient,webpackHot);
        file_js[e].unshift(webpackClient,webpackHot);
    });*/

    // config.entry.index.unshift('webpack-dev-server/client?http://'+pkg.config.devHost+':'+pkg.config.devPort+'', "webpack/hot/dev-server");
    config = Merge(
        config,
        {
            plugins: [
                // Enable multi-pass compilation for enhanced performance
                // in larger projects. Good default.
                new webpack.HotModuleReplacementPlugin({
                    multiStep: true
                }),
                // new OpenBrowserPlugin({url: 'http://' + pkg.config.devHost + ':' + pkg.config.devPort + PATHS.publicPath + 'index.html'})
            ],
            devServer: {
                contentBase: PATHS.publicPath,
                // Enable history API fallback so HTML5 History API based
                // routing works. This is a good default that will come
                // in handy in more complicated setups.
                historyApiFallback: true,

                // Unlike the cli flag, this doesn't set
                // HotModuleReplacementPlugin!
                hot: true,
                inline: true,

                // Display only errors to reduce the amount of output.
                stats: 'errors-only',

                // Parse host and port from env to allow customization.
                //
                // If you use Vagrant or Cloud9, set
                // host: options.host || '0.0.0.0';
                //
                // 0.0.0.0 is available to all network devices
                // unlike default `localhost`.
                host: pkg.config.devHost, // Defaults to `localhost`   process.env.HOST
                port: pkg.config.devPort,  // Defaults to 8080   process.env.PORT
                /*
                 *  代理访问
                 *  1、可以绕过同源策略 和 webpack '热更新'结合使用
                 */
                /*proxy: {
                    '/devApi/!*': {
                        target: pkg.config.devApi,
                        secure: true,
                        /!*
                         * rewrite 的方式扩展性更强，不限制服务的名称
                         * *!/
                        rewrite: function (req) {
                            req.url = req.url.replace(/^\/devApi/, '');
                        }
                    }
                }*/
            }
        }
    );
}

//module.exports = validate(config);
module.exports = config;






