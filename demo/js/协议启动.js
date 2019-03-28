const {app} = require('electron');
const path =require('path');

if (!app) return;
if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient('electron-demo', process.execPath, [path.resolve(process.argv[1])])
    }
} else {
    app.setAsDefaultProtocolClient('electron-demo')
}

app.on('open-url', (event, url) => {
    console.log(event);
    console.log(url);
    dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)
});
