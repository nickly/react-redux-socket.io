const webpack = require('webpack');

const  vendors = [
    'react',
    'react-dom',
    'react-router',
    'react-redux',
    'redux',
    'redux-promise',
    'redux-thunk',
    'lodash',
    'react-mobile-datepicker'
];

module.exports = {
    output: {
        path: './build/',     //把vendors中指定的包预先打包到这个路径中;
        filename: '[name].js',
        library: '[name]',
    },
    entry:{
       'vendors': vendors,
    },
    plugins: [
        new webpack.DllPlugin({
            path: 'manifest.json',
            name: '[name]',
            context: __dirname
        })
    ]
}
