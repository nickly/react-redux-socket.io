'use strict';

/*这个用于合并零碎的单个reduce*/
import { combineReducers } from 'redux';
import {connectServer_Reducer} from './login.reducers';
import {gameHallInformation_Reducer} from './selectRoom.reducers';


//把各个reduce放到一个reducers对象里面;
const reducers = {
    connectServer_Reducer,
    gameHallInformation_Reducer,
};

//使用redux的combineReducers方法将所有reducer打包起来
export default combineReducers({
    ...reducers
})



