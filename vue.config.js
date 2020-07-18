module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      customFileProtocol: 'myCustomProtocol://./', // Make sure to add "./" to the end of the protocol
      // If you want to use the file:// protocol, add win.loadURL(`file://${__dirname}/index.html`) to your main process file
      // In place of win.loadURL('app://./index.html'), and set customFileProtocol to './'
      customFileProtocol: './'
    }
  },
  configureWebpack: config => {
    //   config.externals = [/^firebase/]
    // config.resolve = {
    //   mainFields: [ 'main', 'browser', 'module']
    // }
    
  }
}