// 载入electron模块
const {app,BrowserWindow } = require("electron");

let {buildMenu,findReopenMenuItem} = require('./demo/js/创建菜单');
const {shortcut,unregister} = require('./demo/js/设置全局快捷键');
require('./demo/js/ipcMain');//进程间通讯
require('./demo/js/任务列表');//任务列表
require('./demo/js/settings');//任务列表
require('./demo/js/创建状态栏视图');//任务列表

// const {Single}  =require('./demo/js/单例启动');


// 创建应用程序对象
// 创建一个浏览器窗口，主要用来加载HTML页面

// 声明一个BrowserWindow对象实例
mainWindow = global.mainWindow;

const debug = /--debug/.test(process.argv[2]);

// 监听应用程序对象是否初始化完成，初始化完成之后即可创建浏览器窗口
app.on("ready",()=>{
    buildMenu();
    createWindow();
    shortcut();

    // Single(mainWindow) //需要时打开

});

// 监听应用程序对象中的所有浏览器窗口对象是否全部被关闭，如果全部被关闭，则退出整个应用程序。该
app.on("window-all-closed",function(){
    // 判断当前操作系统是否是window系统，因为这个事件只作用在window系统中
    if(process.platform!="darwin"){
        // 退出整个应用程序
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
});

app.on('window-all-closed', function () {
    let reopenMenuItem = findReopenMenuItem();
    if (reopenMenuItem) reopenMenuItem.enabled = true;
    app.quit()
});


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
    mainWindow.loadURL('file://'+__dirname+'/demo/html/index.html');
    // 同时也可以简化成：mainWindow.loadURL('./index.html');

    // 监听浏览器窗口对象是否关闭，关闭之后直接将mainWindow指向空引用，也就是回收对象内存空间
    mainWindow.on("closed",function(){
        mainWindow = null;
    });

    const  {updateHandle} = require('./demo/js/设置更新');//任务列表
    updateHandle()
}



app.on('will-quit', () => {
    unregister()
});
