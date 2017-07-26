'use strict';

const gameHallInformation_State = {
    gameHallInformation: []
}

const  gameHallInformation_Reducer = (state = gameHallInformation_State , action)=>{
    if (typeof state === "undfined") return {gameHallInformation: []};
    switch (action.type){
        case 'client/getGameHallInformation':
            return {
                gameHallInformation: action.gameHallInformation
            }
        case 'client/getSelectSeat':
            return {
                gameHallInformation: Object.assign([],state.gameHallInformation,action.gameHallInformation)
            }
        default:
            return state;
    }
}

export  {
    gameHallInformation_Reducer,
}