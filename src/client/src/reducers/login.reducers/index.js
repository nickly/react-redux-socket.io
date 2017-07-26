'use strict';

const connectServer_State = {
    username:'',
    isLogin: false
}

const  connectServer_Reducer = (state = connectServer_State , action)=>{

    if (typeof state === "undfined") return {username: '' , isLogin: false};

        switch (action.type){
            case 'client/isLogin':
                return {
                    username: action.username,
                    isLogin: action.isLogin
                }
            default:
                return state;
        }

}

export  {
    connectServer_Reducer,
}