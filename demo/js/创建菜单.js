const {Menu,app,autoUpdater,BrowserWindow,shell}=require('electron');

const template = [
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
            autoUpdater.checkForUpdates()
        }
    }, {
        label: 'Restart and Install Update',
        enabled: true,
        visible: false,
        key: 'restartToUpdate',
        click: function () {
            autoUpdater.quitAndInstall()
        }
    }];

    items.splice.apply(items, [position, 0].concat(updateItems))
}


/**
 *  自定义菜单
 */
exports.buildMenu=()=> {

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu); // 设置菜单部分


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
        });

        // Window menu.
        template[3].submenu.push({
            type: 'separator'
        }, {
            label: 'Bring All to Front',
            role: 'front'
        });

        addUpdateMenuItems(template[0].submenu, 1)
    }

// 针对Windows端的一些配置
    if (process.platform === 'win32') {
        const helpMenu = template[template.length - 1].submenu;
        addUpdateMenuItems(helpMenu, 0)
    }

};

/**
 *  自定义菜单
 */
exports.findReopenMenuItem=()=>{
    const menu = Menu.getApplicationMenu();
    if (!menu) return;

    let reopenMenuItem;
    menu.items.forEach(function (item) {
        if (item.submenu) {
            item.submenu.items.forEach(function (item) {
                if (item.key === 'reopenMenuItem') {
                    reopenMenuItem = item;
                }
            })
        }
    });
    return reopenMenuItem;

};