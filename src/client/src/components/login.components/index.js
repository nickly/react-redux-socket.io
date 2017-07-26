'use strict';

import  React                            from 'react';
import  ReactDOM                   from 'react-dom';
import  PropTypes                    from 'prop-types';

class Login extends  React.Component {

    static  propTypes = {
        //属性;


        //方法;
        connectServer: PropTypes.func.isRequired,
    }

    loginHandle(_this){

         let  username = ReactDOM.findDOMNode(this.refs.username).value;

         if(username  && 0 < username.length){
             this.props.connectServer(username);
         }else{
             alert('用户名不能为空！');
             return;
         }

    }

    render() {

        return(

            <div className="game_loginForm">
                 <img src={require('../../../static/images/game_loginFormTitle.png')}  className="game_loginFormTitle"/>
                 <img src={require('../../../static/images/game_loginFormBackground.png')}  className="game_loginFormBackground"/>
                 <div className="game_loginUsername"><input type="text"   placeholder="请输入用户名" className="game_loginUsername_input"  ref="username"/></div>
                 <div className="game_loginPassWord"><input type="text"  placeholder="请输入密码" className="game_loginUsername_input"/></div>
                 <div className="game_loginButtons">
                     <div className="game_loginButtons_login" onClick={this.loginHandle.bind(this)}></div>
                     <div className="game_loginButtons_register"></div>
                 </div>
                 <div className="game_loginRectangle"></div>
            </div>
        )
    }
}

module.exports = Login;
