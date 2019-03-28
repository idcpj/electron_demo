const {ipcMain} =require('electron')


//ipcMain  处理
ipcMain.on("main_liston",(event,arg)=>{
    console.log(arg);
    event.sender.send("renderer_liston",'main to renderer')
});