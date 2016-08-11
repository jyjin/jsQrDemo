var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');
var log = function(s) {
    console.log(s + '\n+------------------------------------+')
}

var config = {
    entry: {
        index: './js/index',
    },
    output: {
        path: path.join(__dirname, '/bin'),
        filename: '[name].bundle.js',
        publicPath: '/assets/'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader"),
        }, {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader"),
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=1024000'
        }, {
            test: /\.html$/,
            loader: 'handlebars-loader'
        }, {
            test: /\.jade$/,
            loader: 'jade-loader'
        }]
    },
    resolve: {
        extensions: ['', '.js'],
    }
}

module.exports = config;
