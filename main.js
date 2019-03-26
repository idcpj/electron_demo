// 载入electron模块
const {app,BrowserWindow,Menu,shell,globalShortcut } = require("electron");

// 创建应用程序对象
// 创建一个浏览器窗口，主要用来加载HTML页面

// 声明一个BrowserWindow对象实例
let mainWindow;

const debug = /--debug/.test(process.argv[2]);

// 监听应用程序对象是否初始化完成，初始化完成之后即可创建浏览器窗口
app.on("ready",()=>{
    buildMenu();
    createWindow();
    shortcut();
});

// 监听应用程序对象中的所有浏览器窗口对象是否全部被关闭，如果全部被关闭，则退出整个应用程序。该
app.on("window-all-closed",function(){
    // 判断当前操作系统是否是window系统，因为这个事件只作用在window系统中
    if(process.platform!="darwin"){
        // 退出整个应用程序
        app.quit();
    }
});

// 监听应用程序图标被通过点或者没有任何浏览器窗口显示在桌面上，那我们应该重新创建并打开浏览器窗口，避免Mac OS X系统回收或者销毁浏览器窗口
app.on("activate",function(){
    if(mainWindow===null){
        createWindow();
    }
});



app.on('ondragstart', (event, filePath) => {
    event.sender.startDrag({
        file: filePath,
        icon: '1.png'
    })
});

app.on('browser-window-created', function () {
    let reopenMenuItem = findReopenMenuItem();
    if (reopenMenuItem) reopenMenuItem.enabled = false
})

app.on('window-all-closed', function () {
    let reopenMenuItem = findReopenMenuItem();
    if (reopenMenuItem) reopenMenuItem.enabled = true
    app.quit()
})


//定义一个创建浏览器窗口的方法
function createWindow(){

    // 创建一个浏览器窗口对象，并指定窗口的大小
    mainWindow=new BrowserWindow({
        width:1200,
        height:800,
        nodeIntegration:true
    });

    if (debug){
        mainWindow.webContents.openDevTools();
        // mainWindow.maximize();//最大化运行
    }

    // 通过浏览器窗口对象加载index.html文件，同时也是可以加载一个互联网地址的
    mainWindow.loadURL('file://'+__dirname+'/demo/hmtl/index.html');
    // 同时也可以简化成：mainWindow.loadURL('./index.html');

    // 监听浏览器窗口对象是否关闭，关闭之后直接将mainWindow指向空引用，也就是回收对象内存空间
    mainWindow.on("closed",function(){
        mainWindow = null;
    });
}

/**
 *  自定义菜单
 */
function buildMenu() {
    let template = [
        {
            label: 'Edit ( 操作 )',
            submenu: [{
                label: 'Copy ( 复制 )',
                accelerator: 'CmdOrCtrl+C',
                role: 'copy'
            }, {
                label: 'Paste ( 粘贴 )',
                accelerator: 'CmdOrCtrl+V',
                role: 'paste'
            }, {
                label: 'Reload ( 重新加载 )',
                accelerator: 'CmdOrCtrl+R',
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        // on reload, start fresh and close any old
                        // open secondary windows
                        if (focusedWindow.id === 1) {
                            BrowserWindow.getAllWindows().forEach(function (win) {
                                if (win.id > 1) {
                                    win.close()
                                }
                            })
                        }
                        focusedWindow.reload()
                    }
                }
            }]
        },
        {
            label: 'Window ( 窗口 )',
            role: 'window',
            submenu: [{
                label: 'Minimize ( 最小化 )',
                accelerator: 'CmdOrCtrl+M',
                role: 'minimize'
            }, {
                label: 'Close ( 关闭 )',
                accelerator: 'CmdOrCtrl+W',
                role: 'close'
            }, {
                label: '切换开发者工具',
                accelerator: (function () {
                    if (process.platform === 'darwin') {
                        return 'Alt+Command+I'
                    } else {
                        return 'Ctrl+Shift+I'
                    }
                })(),
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        focusedWindow.toggleDevTools()
                    }
                }
            }, {
                type: 'separator'
            }]
        },
        {
            label: 'Help ( 帮助 ) ',
            role: 'help',
            submenu: [{
                label: 'FeedBack ( 意见反馈 )',
                click: function () {
                    shell.openExternal('https://forum.iptchain.net')
                }
            },{
                label:"测试二级测试",
                submenu:[{
                    label:"打开窗口",
                    click(){
                        shell.openExternal('https://idcpj.github.io');
                    }
                }]
            }
            ]
        },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu) // 设置菜单部分

    /**
     * 增加更新相关的菜单选项
     */
    function addUpdateMenuItems (items, position) {
        if (process.mas) return;

        const version = app.getVersion();
        let updateItems = [{
            label: `Version ${version}`,
            enabled: false
        }, {
            label: 'Checking for Update',
            enabled: false,
            key: 'checkingForUpdate'
        }, {
            label: 'Check for Update',
            visible: false,
            key: 'checkForUpdate',
            click: function () {
                require('electron').autoUpdater.checkForUpdates()
            }
        }, {
            label: 'Restart and Install Update',
            enabled: true,
            visible: false,
            key: 'restartToUpdate',
            click: function () {
                require('electron').autoUpdater.quitAndInstall()
            }
        }]

        items.splice.apply(items, [position, 0].concat(updateItems))
    }



// 针对Mac端的一些配置
    if (process.platform === 'darwin') {
        const name = electron.app.getName();
        template.unshift({
            label: name,
            submenu: [{
                label: 'Quit ( 退出 )',
                accelerator: 'Command+Q',
                click: function () {
                    app.quit()
                }
            }]
        })

        // Window menu.
        template[3].submenu.push({
            type: 'separator'
        }, {
            label: 'Bring All to Front',
            role: 'front'
        })

        addUpdateMenuItems(template[0].submenu, 1)
    }

// 针对Windows端的一些配置
    if (process.platform === 'win32') {
        const helpMenu = template[template.length - 1].submenu;
        addUpdateMenuItems(helpMenu, 0)
    }

}

/**
 * 自定义菜单
 * @returns {*}
 */
function findReopenMenuItem () {
    const menu = Menu.getApplicationMenu();
    if (!menu) return;

    let reopenMenuItem
    menu.items.forEach(function (item) {
        if (item.submenu) {
            item.submenu.items.forEach(function (item) {
                if (item.key === 'reopenMenuItem') {
                    reopenMenuItem = item
                }
            })
        }
    })
    return reopenMenuItem;
}


/**
 * 设置全局快捷键
 */
function shortcut() {
    const ret = globalShortcut.register('CommandOrControl+X', () => {
        console.log('CommandOrControl+X is pressed')
    })
    if (!ret) {
        console.log('registration failed')
    }

    console.log(globalShortcut.isRegistered('CommandOrControl+X'))

}

app.on('will-quit', () => {
    // 注销快捷键
    globalShortcut.unregister('CommandOrControl+X');

    // 注销所有快捷键
    globalShortcut.unregisterAll()
});