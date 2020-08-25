const fs = require('fs')

function cachePack(options = {
  subDir:''
}) {
  // 使用 options 设置插件实例……
  this.subDir = options.subDir
  this.cacheData = ''
  this.filelist = '{\n'
}


cachePack.prototype.apply = function(compiler) {
  let that = this
  
  // 读取缓存文件
  if(fs.existsSync('./'+that.subDir+'cache.js')){
    var data = fs.readFileSync('./'+that.subDir+'cache.js');
    that.cacheData = eval('('+data.toString()+')')
  }

  compiler.hooks.compilation.tap("cachePack", compilation => {
    
    // 模块中的静态资源过滤
    compilation.hooks.moduleAsset.tap("cachePack", (module, filename) => {
      let arr = []
      if(!/^_./.test(filename) && that.cacheData){
        that.filelist += ('"'+module.renderedHash+'":'+ true +',\n');
        if(that.cacheData[module.renderedHash]){
          delete compilation.assets[filename]
        }
      }
    })
    // chunk中的静态资源过滤
    compilation.hooks.chunkAsset.tap("cachePack", (chunk, filename) => {
      let contentHash = chunk.contentHash.javascript
      let arr = []
      if(!/^_./.test(filename) && that.cacheData){
        that.filelist += ('"'+contentHash+'":'+ true +',\n');
        if(that.cacheData[contentHash]){
          // 主要避免后期优化资源造成的时间（主要节省时间点）
          chunk.files = []
          delete compilation.assets[filename]
        }
      }
    })
  });
  
  compiler.hooks.emit.tapAsync('cachePack', function(compilation, callback) {
    // 写入缓存文件
    that.filelist += '}';
    fs.writeFileSync('./'+that.subDir+'cache.js', that.filelist)
    callback();
  });
};

module.exports = cachePack;