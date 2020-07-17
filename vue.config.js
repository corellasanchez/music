module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    }
  },
  configureWebpack: config => {
    //   config.externals = [/^firebase/]
    // config.resolve = {
    //   mainFields: [ 'main', 'browser', 'module']
    // }
    
  }
}