const menubar = require('menubar');
let opts={
    dir:process.cwd(),//默认 eg:"D:\js\ele_demo"
    index: 'file://' + process.cwd()+'/demo/html/menubar_index.html',
    icon:"assets/img/ele.png",
    tooltip:"托盘图标工具提示文本",
    width:500,
    height:600,
    // x:null, //默认 null
    // y:null,  //默认 null
    // alwaysOnTop:true, //默认false 只有点击托盘才能取消,且置顶
    showOnAllWorkspaces:true, //默认 true,使窗口在所有OS X工作区上可用。
    showDockIcon:false, //默认false, 点开后,在 dock 栏显示
    // showOnRightClick:true,//默认false,用右键点击代替点击

};


const mb = menubar(opts)

mb.on('ready', () =>{
    console.log("ready");
})
mb.on('create-window', () =>{
    console.log("create-window");
})
mb.on('show', () =>{
    console.log("show");
})
mb.on('after-show', () =>{
    console.log("after-show");
})
mb.on('hide', () =>{
    console.log("hide ");
})
mb.on('after-hide', () =>{
    console.log("after-hide ");
})
mb.on('after-close', () =>{
    console.log("after-close");
})

//只在设置 alwaysOnTop:true 时, 是去焦点才有效
mb.on('focus-lost', () =>{
    console.log("focus-lost");
})