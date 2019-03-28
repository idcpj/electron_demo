const {globalShortcut} = require('electron');
/**
 * 设置全局快捷键
 */
exports.shortcut=()=>{
    const ret = globalShortcut.register('CommandOrControl+9', () => {
        console.log('CommandOrControl+9 is pressed')
    });
    if (!ret) {
        console.log('registration failed')
    }else{
        console.log('globalShortcut is ok');
    }

    console.log("is globalShortcut  : ",globalShortcut.isRegistered('CommandOrControl+9'))

};


exports.unregister=()=>{
    // 注销快捷键
    globalShortcut.unregister('CommandOrControl+9');

    // 注销所有快捷键
    globalShortcut.unregisterAll()
}