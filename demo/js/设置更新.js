const {ipcMain} = require('electron')

const {autoUpdater} = require('electron-updater');
const uploadUrl=`https://raw.githubusercontent.com/idcpj/electron_demo/master/dist`


// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
mainWindow = global.mainWindow

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
    console.log(text);
    mainWindow.webContents.send('message', text)
}


exports.updateHandle=() =>{
    let message = {
        error: '检查更新出错',
        checking: '正在检查更新……',
        updateAva: '检测到新版本，正在下载……',
        updateNotAva: '现在使用的就是最新版本，不用更新',
    };

    autoUpdater.setFeedURL(uploadUrl);
    autoUpdater.on('error', function (error) {
        // console.log('===error===');
        // console.log(error);
        sendUpdateMessage(message.error)
    });
    autoUpdater.on('checking-for-update', function () {
        // console.log('===checking-for-update===');

        sendUpdateMessage(message.checking)
    });
    autoUpdater.on('update-available', function (info) {
        // console.log('===update-available===');

        sendUpdateMessage(message.updateAva)
    });
    autoUpdater.on('update-not-available', function (info) {
        // console.log('===update-not-available===');
        sendUpdateMessage(message.updateNotAva)
    });

    // 更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj) {
        // console.log('===download-progress===');
        mainWindow.webContents.send('downloadProgress', progressObj)
    })
    autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
        // console.log("==update-downloaded===");
        ipcMain.on('isUpdateNow', (e, arg) => {
            // console.log("开始更新");
            //some code here to handle event
            autoUpdater.quitAndInstall();
        });

        mainWindow.webContents.send('isUpdateNow')
    });

    //接受更新指令
    ipcMain.on("checkForUpdate",()=>{
        // console.log("===checkForUpdate===");
        //执行自动更新检查
        autoUpdater.checkForUpdates();
    })
}