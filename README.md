# cachePack

#### 很多时候我们webpack生成的时候都只想生成我修改的文件，其余文件不生成而且这样也能加快一部分时间。cachePack就是为了解决这个需求

```bash
# 先安装插件
$ (c)npm install cachePack -D

# 引入插件 webpack.config.js(配置文件)
$ const CachePack = require('cachePack')
# 使用插件
$ plugins: [(new CachePack()]

# 首次构建所有项目
$ npm run build
# 修改文件后再次构建
$ npm run build

# 参数设置
{
	# 缓存文件目录名称 默认为空
	subDir: '' 
}

```
check out [xiayulin](https://www.xiayulin.top).
