'use strict';

import    React                   from 'react'
import    { render }             from  'react-dom';
import    { Provider }          from 'react-redux';
import    configureStore    from  './src/store';
import    routes                  from  './src/routes';

import  './src/libs/flexible.min';
require('./static/stylesheets/style');

const  store                   = configureStore();
const  rootElement       = document.createElement('app');
document.body.appendChild(rootElement);

render((
    <Provider store={store} >
        {routes}
    </Provider>
), rootElement);