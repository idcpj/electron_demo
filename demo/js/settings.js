const {app} =require('electron');
const settings = require('electron-settings');

app.on('ready',()=>{
    settings.set('name', {
        first: 'Cosmo',
        last: 'Kramer'
    });
})