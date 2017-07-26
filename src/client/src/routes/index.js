'use strict';

import React, { Component } from 'react'
import  {Router , Route , browserHistory , hashHistory }  from 'react-router';

const rootRoute ={

    childRoutes: [{
            path: '/',
            getComponent(location, callback, params) {
                require.ensure([], (require) => {
                    callback(null, require('../containers/login.container/index').default);
                })
            }
        },
        {
            path: '/selectRoom',
            getComponent(location, callback, params) {
                require.ensure([], (require) => {
                    callback(null, require('../containers/selectRoom.container/index').default);
                })
            }
        },
     ]
}

const  routes = (<Router  routes={rootRoute}   history={browserHistory} />)

export  default   routes;

