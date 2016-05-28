var path = require('path');

var webpack = require('webpack');

var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        login : './src/login.js',
        admin : './src/adminRouters.js',
        home : './src/home.js'
    },
    output: {
        path : './public',
        filename: '[name].js'
    },
    module: {
        loaders : [
            {
                test: /(\.eot)|(\.woff2?)|(\.tff)$/,
                loader: 'file-loader'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.gif/,
                loader: 'url-loader?limit=10000&mimetype=image/gif'
            },
            {
                test: /\.jpg/,
                loader: 'url-loader?limit=10000&mimetype=image/jpg'
            },
            {
                test: /\.png/,
                loader: 'url-loader?limit=10000&mimetype=image/png'
            },
            {
                test: /\.svg/,
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
            },
            {
                test: /\.jsx?$/,
                exclude: 'node_modules',
                loader: 'babel?presets[]=react,presets[]=es2015'
            }
        ]
    },
    plugins : [
        new webpack.optimize.CommonsChunkPlugin('common.js'),
        new ExtractTextPlugin('style.css')
    ]
};