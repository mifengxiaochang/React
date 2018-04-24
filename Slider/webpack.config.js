var webpack = require('webpack');
var React = require("react");
var path = require('path');
var DEV = path.resolve(__dirname,"dev")
var outputPath = path.resolve(__dirname,"output");

//多文件打包
var glob = require('glob');
var entries=function(){
  var jsDir = path.resolve(srcDir,'js');
  var entryFiles = glob.sync(jsDir + '/*.{js,jsx}');
  var map={};
};

var config = {
  entry: DEV+'/index.jsx',
  output: {
    path:outputPath,
    publicPath:"output/",//用于表明图片等资源引用的路径
    filename:"index.js"
  },
  module: {
    loaders: [
      {
      	include:DEV,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
      	loader: 'style-loader!css-loader'//需要用npm下载XX-loader
  	  },
      {
      	test: /.(png|jpg)$/,
      	loader: "url-loader?limit=8192&name=images/[hash:8].[name].[ext]"
      },
       {
          test: /\.less$/,
          loader: "style-loader!css-loader!less-loader"
        }
    ]
  }
};

module.exports = config;
