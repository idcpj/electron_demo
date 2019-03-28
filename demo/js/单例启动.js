const {app} = require('electron');
const gotTheLock = app.requestSingleInstanceLock();


exports.Single=(mainWindow)=>{

    if (!gotTheLock) {
        app.quit()
    } else {
        app.on('second-instance', (event, commandLine, workingDirectory) => {
            // 当运行第二个实例时,将会聚焦到myWindow这个窗口
            if (mainWindow) {
                if (mainWindow.isMinimized()) mainWindow.restore();//创建从最小化恢复
                mainWindow.focus()
            }
        })
    }
}
