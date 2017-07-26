'use strict';

import  React                             from 'react';
import  ReactDOM                    from 'react-dom';
import  { connect }                    from 'react-redux';
import  { bindActionCreators } from 'redux';
import  { browserHistory }         from 'react-router'


const  mapStateToProps =  (state)=> {

    return{
         username: state.connectServer_Reducer.username,
         gameHallInformation: state.gameHallInformation_Reducer.gameHallInformation
    }
}

const actions ={
    /** 请求服务器，获取大厅状态 */
    getGameHallInformation(){
        return{
           type: 'server/gameHallInformation',
        }
    },
    /** 选择座位，并且告诉服务器当前选中了是第几个房间第几个座位; */
    selectPoition(_roomNum, _seatNumber, _username){

        return{
            type: 'server/selectSeat',
            username:  _username,
            roomNum: _roomNum,
            seatNumber: _seatNumber,
        }
    },
}

const  mapDispatchToProps =  (dispatch)=> {
    return  {
        actions: bindActionCreators(actions, dispatch)
    };
}


class SelectRoomContainer extends  React.Component {

    componentWillMount() {
       /** 加载初始化信息 */
       this.props.actions.getGameHallInformation();
    }

    selectSeatHandle(roomNum , seatNumber){
        this.props.actions.selectPoition(roomNum, seatNumber)
    }

    render() {

        /**  如果没有登录的话 */
        if(!this.props.username){
            browserHistory.push('/');
        }

        /**  key值是房号，value对象是每个座位上是否有人进去的状态; */
        const  gameHallInformation = this.props.gameHallInformation;

        /** 头部选择，假如选择了现实该用户头像，没有选择则现实空座位 */
        const  headerState = (roomState) =>{
            if(roomState.seat) {
                return (
                    <span className="room_Player">
                       <i className="room_PlayerHeader">
                         <img src={require('../../../static/images/game_defaultHeader.png')}/>
                      </i>
                       <i className="room_PlayerName">{roomState.whoIsPresent}</i>
                   </span>
                )
             }else{
                    return(
                        <i className="room_noPlayer"  ></i>
                    )
              }
        }


        /**  数据源中的座位 */
       const  gameHallItem =  gameHallInformation.map((item, index)=>{
             let  roomNumber = index + 1;
             return (
                 <li className="web_room" data-roomID={"room_"+ roomNumber}  key={roomNumber}>
                     <div className="web_room_con">
                         <img src={require('../../../static/images/game_chair.png')} />
                         <div className="web_room_player">
                                     <span className="room_player1"  onClick={this.selectSeatHandle.bind(this, roomNumber, 0, this.props.username)}>
                                         { headerState(item.roomState[0]) }
                                     </span>
                             <span className="room_player2"   onClick={this.selectSeatHandle.bind(this, roomNumber, 1, this.props.username)}>
                                         { headerState(item.roomState[1]) }
                                    </span>
                             <span className="room_player3"   onClick={this.selectSeatHandle.bind(this, roomNumber, 2, this.props.username)}>
                                         { headerState(item.roomState[2]) }
                                   </span>
                         </div>
                         <div className="web_brandBlock"></div>
                         <div className="web_room_number"><i>房号: {roomNumber < 9? "0"+roomNumber : roomNumber}</i></div>
                     </div>
                 </li>
             )
        })


       return (
                    <div>
                        <div className="web_gameTitle"><i>欢迎您,请选择房间号</i></div>
                        <div className="web_roomBlock">
                            <ul>
                                {gameHallItem}
                            </ul>
                        </div>
                    </div>
        )

    }

    componentDidMount(){
    }

}

export default  connect(mapStateToProps  , mapDispatchToProps)(SelectRoomContainer);