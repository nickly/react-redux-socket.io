'use strict';

import  React                              from 'react';
import  { connect }                      from 'react-redux';
import  { bindActionCreators }   from 'redux';
import  { browserHistory }           from 'react-router'

import  Login                               from '../../components/login.components'

const  mapStateToProps =  (state)=> {
    return{
       username: state.connectServer_Reducer.username,
       isLogin: state.connectServer_Reducer.isLogin,
    }
}

const  actions = {

    /** 连接服务端 */
    connectServer(username) {
        return {
            type: 'server/login',
            username: username
        };
    },
}

const  mapDispatchToProps =  (dispatch)=> {
    return{
        actions: bindActionCreators(actions, dispatch)
    }
}

class LoginContainer extends  React.Component {

    render(){

        /**  当isLogin为true的时候就跳到选择房间 */
        if(this.props.isLogin){
           browserHistory.push('/selectRoom');
        }

        const  loginProps ={
            connectServer: this.props.actions.connectServer,
        }

        return(
            <div className="game_loginBackground">
                <div className="game_colorcPaper"></div>
                <div className="game_lady"><img src={require('../../../static/images/game_loginLady.png')} /></div>
                <Login  {...loginProps}/>
            </div>
         )
    }
}

export default  connect(mapStateToProps  , mapDispatchToProps)(LoginContainer);