const webpack = require('webpack');

const  MyPlugin = require('./webpack.myPlugin');

//分离css插件,需要安装extract-text-webpack-plugin;
const ExtractTextPlugin = require("extract-text-webpack-plugin");

//注意这个插件需要安装html-webpack-plugin;
const htmlWebpackPlugin = require('html-webpack-plugin');

//这个插件用于并行编译,让打包任务多线程并列运行;
const  os                           = require('os');
const  HappyPack            = require('happypack');
const  happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

//这个插件用于并行压缩,让压缩任务多线程并列运行;
const UglifyJsParallelPlugin = require('webpack-uglify-parallel');

const  assetsPath               = "./assets/";
const  path                        = require('path');
const  buildPath               = path.resolve(__dirname,"./dist/");
const  nodemodulesPath = path.resolve(__dirname,'./node_modules/');

const  config = {

    /*现在的代码是合并以后的代码，不利于排错和定位,这样出错以后就会采用source-map的形式直接显示你出错代码的位置;*/
    devtool: 'eval-source-map',

    /*打包的入口文件;*/
    entry: {
        build:'./js/index.js'

        /*添加要打包在vendors里面的库*/
        //vendors: []

    },

    /*打包编译完成的文件路径;
     filename:'[name].[hash].js'  打包编译完成后的文件名,多个入口的时候可以使用[name], [hash]是生成hash值防止缓存;
     */
    output:{
        path: buildPath,
        filename:'[name].js',
        chunkFilename:'[name].js'
        //filename:'[name]_[chunkhash:6].js',
        //chunkFilename:'[name]_[chunkhash:6].js'
        /*如果没有设置，则默认从站点根目录加载。用于热更新或者热加载;*/
        //publicPath: '资源目录'
    },

    /*添加加载器;*/
    module:{
        loaders:[
            {

             //=======普通不分离css=========
             /*
             test:/.css$/,                                            //查找带.css后缀名的文件进行打包，这里test是一个正则;
             loaders:['style-loader','css-loader'],    //这里是处理匹配文件的方法，如果不用这个配置文件的时候是style!和css!，注意执行顺序是从右到左，所以把css放第二个参数;
             exclude: nodemodulesPath                //排除这个文件不需要查找是否有.css的文件;
             include: path.resolve(__dirname,assetsPath+'/css/')
             */
            

            //=======分离css=========
            //注意extract-text-webpack-plugin插件不难用到happypack中;
            test:/.css$/,
            loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader' }),   //需要使用ExtractTextPlugin.extract来加载style-loader和css-loader;
            exclude: nodemodulesPath,
            include: path.resolve(__dirname,assetsPath+'/css/')

        },
        /*{

            //======使用happypack后的配置=========
            //注意 loaders: ['happypack/loader?id=scss']中的id;
            test: /\.scss/,
            loaders: ['happypack/loader?id=scss'],
            exclude: nodemodulesPath,
            include: path.resolve(__dirname,assetsPath+'/scss/')

        },*/
        {
            
            test: /\.(jpg|jpeg|png|svg|gif|ttf)$/,
            loader: ['happypack/loader?id=assets'],
            exclude: nodemodulesPath

        },{
            //======默认的babel配置方式=========
            /*
            test: /\.js|jsx$/,
            loaders: ['react-hot-loader', 'babel-loader?cacheDirectory=true&presets[]=es2015&presets[]=react'],   //这里是取参数，加上这个才可以使用react-hot-loader的;
            exclude: nodemodulesPath,
            include: path.resolve(__dirname,'./js/')    //注意__dirname表示当前项目根目录
            */

            //======使用happypack后的配置=========
            //注意loaders: ['happypack/loader?id=js']中的id;
            test: /\.js|jsx$/,
            loaders: ['happypack/loader?id=js'],
            exclude: /(node_modules|bower_components|helpers\/lib|\.spec\.js$)/,
            include: path.resolve(__dirname,'./js/')
           
        }]
    },
    resolve:{
        /*自动补全识别后缀; */
        extensions: ['.js' , '.jsx' , '.es6' , '.css' , '.scss' , '.png' , '.jpg' , '.jpeg']
    },
    plugins:[

        /*======分离css======*/
        new ExtractTextPlugin("[name].css"),

        /*
        new HappyPack({
            id: 'scss',
            threadPool: happyThreadPool,
            loaders: ['style-loader!css-loader!sass-loader?outputStyle=expanded']
        }),
        */

        new HappyPack({
            id: 'assets',
            threadPool: happyThreadPool,
            loaders: ['url-loader?limit=10000'],
            cache: true,
            verbose: true
        }),

        new HappyPack({
            id: 'js',
            loaders: ['react-hot-loader', 'babel-loader?cacheDirectory=true&presets[]=es2015&presets[]=react&presets[]=stage-0'],
            threadPool: happyThreadPool,
            cache: true,
            verbose: true
        }) ,

        //======普通压缩======
        //这个使用uglifyJs压缩你的js代码,
        //mangle: 用了这个配置，webpack不会损坏 “ $super”, “$”, ‘exports’ 或者 ‘require’这些关键词。
        
        /*
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            mangle: {
                except: ['$super', '$', 'exports', 'require']
            }
        }),
        */

        //======多核压缩======
        //比UglifyJsPlugin压缩速度更快;
       new UglifyJsParallelPlugin({
           workers: os.cpus().length,
           output: {
               ascii_only: true,
           },
           compress: {
               warnings: false,
           },
           sourceMap: false
       }),


        /* ====去重复(webpack2.0废除了这个插件)====
         如果你使用了一些有着很酷的依赖树的库，那么它可能存在一些文件是重复的。
         webpack可以找到这些文件并去重。这保证了重复的代码不被大包到bundle文件里面去，
         取而代之的是运行时请求一个封装的函数。不会影响语义
         等同于在package.json中script中加入--optimize-dedupe命令;
         */
         //new webpack.optimize.DedupePlugin(),    webpack2.0废除了这个插件;



        /*====减少分包过多造成的过多请求====
         当coding的时候，你可能已经添加了许多分割点来按需加载。但编译完了之后你发现有太多
         细小的模块造成了很大的HTTP损耗。幸运的是Webpack可以处理这个问题，你可以做下面
         两件事情来合并一些请求：
         new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15})
         等同于在package.json中script中加入--optimize-max-chunks 15命令;

         new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000})
         等同于在package.json中script中加入--optimize-min-chunk-size 10000命令;
         */
        new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}),
        new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000}),

        //使用了DllPlugin就不能使用webpack.optimize.CommonsChunkPlugin;
        /*
        new webpack.DllReferencePlugin({
              context: __dirname,
              manifest: require('./manifest.json')
        }),
        */


        /*====把第三方依赖库拆开包====
         把入口文件里面的数组打包成verdors.js
         */
        new webpack.optimize.CommonsChunkPlugin({name:'vendors',filename:'vendors.js'}),


        /*====去除多个文件中的频繁依赖====
         当我们经常使用React、jQuery等外部第三方库的时候，通常在每个业务逻辑JS中都会遇到这些库。
         如我们需要在各个文件中都是有jQuery的$对象，因此我们需要在每个用到jQuery的JS文件的头部
         通过require('jquery')来依赖jQuery。 这样做非常繁琐且重复，因此webpack提供了我们一种比较
         高效的方法，我们可以通过在配置文件中配置使用到的变量名，那么webpack会自动分析，并且在
         编译时帮我们完成这些依赖的引入。
         例子:
         plugins: [
         new webpack.ProvidePlugin({
         'Moment': 'moment',
         "$": "jquery",
         "jQuery": "jquery",
         "window.jQuery": "jquery",
         "React": "react"
         })
         ]

        new webpack.ProvidePlugin({
            //"$": "jquery",
            //"Rx" : "rxjs/RX"
        }),
       */

        /*====允许错误不打断程序
         发布程序时候使用;
        */
        new webpack.NoErrorsPlugin(),


        /*====开发模式下的调试输出和发布模式下的调试输出====
         某些情况，我们需要在页面中输出开发调试内容，但是又不想让这些调试内容在发布的时候泄露出去，
         那么我们可以采用魔力变量(magic globals)来处理
         配置文件：
         __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false')),
         __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))

         业务逻辑代码中写入
         if (__DEV__) {
         console.warn('开发环境需要进行的处理');
         }
         if (__PRERELEASE__) {
         console.log('预发环境需要进行的处理');
         }

         设置环境命令
         "scripts": {
         "dev": "BUILD_DEV=1 webpack-dev-server --progress --colors",
         "build": "BUILD_PRERELEASE=1 webpack -p"
         }
         这样在dev模式下BUILD_DEV=1会令__DEV__逻辑部分输出，然__PRERELEASE__则不会输出;
         BUILD_PRERELEASE=1同理也是这样;
         */
        new webpack.DefinePlugin({
            //BUILD_DEV 是一个变量，可以在package.json中进行设置，假如1则为可以输出，后面的false表示不输出，只能通过发布时候命令BUILD_DEV=1才能输出
            __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false')),
            //同上
            __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
        }),

        /*
        new MyPlugin({
            paths: ["./vendors.js"]
        }),
        */


        /*
         这个是生成html文件的插件;
         假如想生成多个html文件，那么可以看下的循环push配置;
         */
        new htmlWebpackPlugin({
            title:"这个是html的title",
            filename:"index.html",                     //这是生成的html的名字
            //favicon: '路径',
            template: assetsPath+'/template/index.html',     //这是引入的html模版
            chunks:['build','vendors'],
            inject: true,                                       //允许插件修改哪些内容，包括head与body
            hash: true,                                        //为静态资源生成hash值
            minify: {                                            //压缩HTML文件
                removeComments: true,             //移除HTML中的注释
                collapseWhitespace: false          //删除空白符与换行符
            }
        })
    ]
}

module.exports = config;

/*
 假如是多个 new htmlWebpackPlugin，可以把它通过一个循环push到plugins中;
 var object = {};
 for(var i in object){
   module.exports.plugins.push(
     new htmlWebpackPlugin({})
   )
 }
 */



