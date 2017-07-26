'use strict';

/*
     createStore 属于redux里面一个方法，用于包装一层store能支持redux;
     applyMiddleware 属于redux里面一个方法，用于组合中间件;
 */
import  { createStore, applyMiddleware , compose } from 'redux';
import  reducers  from '../reducers';
import  thunk from 'redux-thunk';
import  createSocketIoMiddleware from 'redux-socket.io';
import  io from 'socket.io-client';

/**  连接服务器socket */
const socket = io('ws://127.0.0.1:3000');

const socketIoMiddleware = createSocketIoMiddleware(socket, "server/");

const composeCreateStore = compose(applyMiddleware(thunk, socketIoMiddleware))(createStore);

const  configureStore = (initialState={}) => {
    /* 假如是超集store和普通的createStore使用方式是一样的;*/
    const store = composeCreateStore(reducers,initialState);

    //const store = createStore(reducers, initialState);     //把reducers集合放到store里面进行管理;


    /*如果需要处理reducers的热更新的话，需要加上这个配置*/
    if (module.hot) {
        module.hot.accept('../reducers', () => {
            const nextReducer = require('../reducers').default;
            store.replaceReducer(nextReducer);
        });
    }

    return store;
}
export default  configureStore;