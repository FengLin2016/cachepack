const fs = require('fs')
const path = require('path')
var mkdirp = require('mkdirp')
const dirname = path.dirname(__dirname);

const dir = dirname + '/../.cache/cache-webpack-plugin/'

function cacheWebpackPlugin(options = {
  filename:'.cache',
  all: false
}) {
  // 使用 options 设置插件实例……
  this.cachefilename = options.filename
  this.cacheData = ''
  this.filelist = '{\n'
  this.delList = [] // 待删除文件

  // 是否生成所有, 是就先删除缓存文件
  if(options.all){
    fs.unlinkSync(dir+this.cachefilename)
  }
}



cacheWebpackPlugin.prototype.apply = function(compiler) {
  let that = this
  
  // 读取缓存文件
  if(fs.existsSync(dir+that.cachefilename)){
    var data = fs.readFileSync(dir+that.cachefilename);
    that.cacheData = eval('('+data.toString()+')')
  }

  compiler.hooks.compilation.tap("cacheWebpackPlugin", compilation => {
    
    // 模块中的静态资源过滤
    compilation.hooks.moduleAsset.tap("cacheWebpackPlugin", (module, filename) => {
      if(!/^_./.test(filename)){
        that.filelist += ('"'+module.renderedHash+'":'+ true +',\n');
        if(that.cacheData && that.cacheData[module.renderedHash]){
          // delete compilation.assets[filename]
          that.delList.push(filename)
        }
      }
    })
    // chunk中的静态资源过滤
    compilation.hooks.chunkAsset.tap("cacheWebpackPlugin", (chunk, filename) => {
      let contentHash = chunk.contentHash.javascript
      if(!/^_./.test(filename) ){
        that.filelist += ('"'+contentHash+'":'+ true +',\n');
        if(that.cacheData && that.cacheData[contentHash]){
          that.delList.push(filename)
        }
      }
    })
  });
  
  compiler.hooks.emit.tapAsync('cacheWebpackPlugin', function(compilation, callback) {

    // 删除文件
    that.delList.map(item => {
      delete compilation.assets[item]
    })
    // 写入缓存文件
    that.filelist += '}';
    mkdirp(dirname + '/../.cache/cache-webpack-plugin/').then(mkdirErr =>{
      if (mkdirErr) {
        throw new Error(mkdirErr)
        return;
      }
      fs.writeFileSync(dir+that.cachefilename, that.filelist)
      callback();
    })
  });
};

module.exports = cacheWebpackPlugin;