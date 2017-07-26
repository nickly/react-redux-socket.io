'use strict'

/**  导入express基本所需配置 */
const  express   = require('express')   ;
const  http        = require('http');
const  path       = require('path');
const  lodash_  = require('lodash');

const  app         =  express();
const  router     =  express.Router();

const  server     = http.createServer(app);
const  socketIo = require('socket.io')(server);

const  port        = 3000;


/** 定义一个变量，用于判断是否为开发环境 */
const isDev = process.env.NODE_ENV !== 'production';

/**  如果是开发环境 */
if (isDev){

    /**  导入webpack和webpack-dev-middleware和webpack-hot-middleware，用于express集成webpack编译功能，可同时热更新 */
    const  webpack                           = require('webpack');
    const  webpackDevMiddleware = require('webpack-dev-middleware');
    const  webpackHotMiddleware = require('webpack-hot-middleware');
    const  webpackDevConfig          = require('../../webpack.config.js');
    const  compiler = webpack(webpackDevConfig);

    app.use(webpackDevMiddleware(compiler, {
        /** public path should be the same with webpack config   这里的publicPath会使用webpack.config.js中的publicPath  */
        publicPath: webpackDevConfig.output.publicPath,
        noInfo: true,
        stats: {
            colors: true
        }
    }));
    app.use(webpackHotMiddleware(compiler));


    /** 静态文件中间件 */
    app.use(express.static(path.join(__dirname, '../client/build')));

    /** 监听3000端口 */
    server.listen(port, ()=>{
        console.log((new Date()) + ' Server is listening on port '+server.address().port);
    });

}

/**  加载路由 */
app.get('api/*',  (req, res) => {})
app.get('*',  (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
 })


/** socket服务器监听连接，表示已经建立连接 */
socketIo.on('connection',  (socket)=>{

    const  initializationInformation = [];
    let       gameHallInformation;

    socket.on('action', (action) => {

        switch (action.type){
            /**  判断登录 */
            case 'server/login':

                     console.log('用户'+ action.username + '已经登录');

                     const  user = {};
                     user.username = action.username;
                     user.loginDate = new Date();
                     user.isLogin      = true;
                     initializationInformation.push(user);

                     socket.emit('action', {
                           type:'client/isLogin',
                           username: action.username,
                           isLogin: true
                     });

                 break;

            /**  获取当前游戏大厅的状态信息 */
            case 'server/gameHallInformation':

                     /**  游戏大厅信息 */
                     gameHallInformation = [
                         {
                            'roomNumber': 1 ,
                            'roomSize': 0,
                            'roomState': [
                                { 'seat' : false, 'whoIsPresent' : null },
                                { 'seat' : false, 'whoIsPresent' : null },
                                { 'seat' : false, 'whoIsPresent' : null }
                            ]},
                          {
                             'roomNumber': 2 ,
                             'roomSize': 0,
                             'roomState': [
                                 { 'seat' : false, 'whoIsPresent' : null },
                                 { 'seat' : false, 'whoIsPresent' : null },
                                 { 'seat' : false, 'whoIsPresent' : null }
                             ]},
                           {
                             'roomNumber': 3,
                             'roomSize': 0,
                             'roomState': [
                                 { 'seat' : false, 'whoIsPresent' : null },
                                 { 'seat' : false, 'whoIsPresent' : null },
                                 { 'seat' : false, 'whoIsPresent' : null }
                             ]},
                     ]

                      socket.emit('action', {
                            type:'client/getGameHallInformation',
                            gameHallInformation
                      });
                break;

            /**  当用户选择了房间号和座位，修改游戏大厅的状态 */
            case 'server/selectSeat':



              const list  =   lodash_.map(gameHallInformation,(list, index)=>{


                       /**  循环查找房间号匹配的 */
                       if(list.roomNumber === action.roomNum){


                           /**  当座位上没有人 */
                           if(list.roomState[action.seatNumber].seat == false){

                              /** 清空之前自己的座位 */


                               /** 假如座位上没人，那么就坐下来 */
                               list.roomState[action.seatNumber].seat = true;
                               list.roomState[action.seatNumber].whoIsPresent = action.username;
                               list.roomSize++;

                           /**  当座位上有人 */
                           }else{

                               /** 判断选择座位上的是自己 */
                               if(list.roomState[action.seatNumber].whoIsPresent == action.username){
                                   /** 假如是自己则取消座位 */
                                   list.roomState[action.seatNumber].seat = false;
                                   list.roomState[action.seatNumber].whoIsPresent = null;
                                   list.roomSize--;
                               }
                           }
                       }
                       return  list;
                })

                socket.emit('action', {
                    type:'client/getSelectSeat',
                    gameHallInformation: list
                });

                break;
        }
    });

    /** 向所有客户端发送消息 */
    //socketIo.emit('msg','你好客户端');


})



module.exports = app;
