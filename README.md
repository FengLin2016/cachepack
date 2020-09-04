# cache-webpack-plugin

#### 很多时候我们webpack生成的时候都只想生成我修改的文件，其余文件不生成而且这样也能加快一部分时间。cache-webpack-plugin就是为了解决这个需求。

```bash
# 先安装插件
$ (c)npm install cache-webpack-plugin -D

# 引入插件 webpack.config.js(配置文件)
$ const CacheWebpackPlugin = require('cache-webpack-plugin')
# 使用插件
$ plugins: [(new CacheWebpackPlugin()]

# 首次构建所有项目
$ npm run build
# 修改文件后再次构建
$ npm run build

# 参数设置
{
	# 缓存文件名称
	filename: '' 
}

```
###### tips: 
1、如果想重新生成所有，删除/node_modules/.cahche/cache-webpack-plugin
2、可结合cache-loader配合使用节省打包时间，但是cache-loader和提取css插件有问题（[issues](https://github.com/webpack-contrib/cache-loader/issues/40)）
[xiayulin](https://www.xiayulin.top)
