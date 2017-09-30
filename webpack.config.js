const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = {
    entry: './src/client/index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },

    devtool: 'source-map',

    target: 'electron-main',

    module: {
    rules: [
        {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            })
        },
        {
            test: /\.vue$/,
            use: 'vue-loader'
        },
        {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['babel-preset-stage-0']
                }
            }
        }
    ]},

    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/templates/index.html'
        }),
        new ExtractTextPlugin("styles.css")
    ]
}

module.exports = config;