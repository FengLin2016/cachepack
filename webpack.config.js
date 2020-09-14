const path = require('path');

module.exports = {
	mode: 'production',
    entry: {
        app:'./src/index.js',
    },
    node: {
     fs: "empty",
     path: true,
     __dirname: false
  	},
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        library:"cache-webpack-plugin",// 在全局变量中增加一个library变量
        libraryTarget: 'commonjs2',
        // libraryExport: "default", // 对外暴露default属性，就可以直接调用default里的属性
        // globalObject: 'this'
    },
    resolve: {
        extensions: ['.js'],
        modules: ['node_modules']
    },
    externals:{ 
        "fs": "commonjs fs",
        "path": "commonjs path" 
    },
    module: {
        rules: [
          {
            test: /\.(jsx?|babel|es6)$/,
            include: [path.resolve(__dirname, "src")],
            exclude: /node_modules/,
            loader: 'babel-loader'
          }
        ]
  },
};