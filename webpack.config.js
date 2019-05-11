const webpack = require('webpack');

module.exports = {
    entry:['./app/index.js'],
    output:{
        path: __dirname + '/build',
        filename: 'app.js'
    },

    module: {
        loaders: [
            {
                test:/\.js$/ ,
                loader:'babel-loader',
                exclude: /(node_modules)/,
                query: {
                    presets: ['es2015','stage-0']
                }
            }
        ]
    },

    devServer: {
        inline: true,
        contentBase: './build',
        host: 'localhost',
        port: 3000
    },

    // devtool: 'source-map'

};
