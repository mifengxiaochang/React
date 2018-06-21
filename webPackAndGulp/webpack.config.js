const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const isDevBuild = true;
const outputPath = './wwwroot/resources';

module.exports = {
    mode: "development",
    entry: { index: "./JSX/index.jsx" },
    output: {
        path: path.join(__dirname, outputPath),
        filename: "Index.js",
        publicPath: path.join(__dirname, outputPath)
    },
    watchOptions: {
        aggregateTimeout: 800,
    },
    target: 'node',
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.(png|jpg)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 809600,
                            name: "[name].[ext]",
                            mimetype: 'image/png',
                            outputPath: 'images/'
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: "css-loader"
                })
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'less-loader']
                })
            },
            {
                test: /\.jsx$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: path.join(outputPath, 'babel_cache')
                    }
                }
            }
        ]
    },
    resolve: {
        modules: ["./node_modules"],
        extensions: [".js", ".json", ".jsx", ".css"]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: "[name].css"
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"development"'
            }
        })
    ],
    externals: {
        'react': ' window.__lib.React',
        'react-dom': ' window.__lib.ReactDOM',
        'react-router-dom': ' window.__lib.ReactRouterDOM',
        'redux': ' window.__lib.Redux',
        'react-redux': ' window.__lib.ReactRedux',
        'react-router': ' window.__lib.ReactRouter',
        'babel-polyfill': 'window.__lib.BabelPolyfill',
        '$g': '$g',

        'AveWidgets': 'window.__lib.AveWidgets'
    }
};