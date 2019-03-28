const {app} = require('electron');
app.setJumpList([
    {
        type: 'custom',
        name: 'Recent Projects',
        items: [
            { type: 'file', path: 'C:\\Projects\\project1.proj' },
            { type: 'file', path: 'C:\\Projects\\project2.proj' }
        ]
    },
    { // 已经有一个名字所以 `type` 被认为是 "custom"
        name: 'Tools',
        items: [
            {
                type: 'task',
                title: 'Tool A',
                program: process.execPath,
                args: '--run-tool-a',
                icon: process.execPath,
                iconIndex: 0,
                description: 'Runs Tool A'
            },
            {
                type: 'task',
                title: 'Tool B',
                program: process.execPath,
                args: '--run-tool-b',
                icon: process.execPath,
                iconIndex: 0,
                description: 'Runs Tool B'
            }
        ]
    },
    { type: 'frequent' },
    { //这里没有设置名字 所以 `type` 被认为是 "tasks"
        items: [
            {
                type: 'task',
                title: 'New Project',
                program: process.execPath,
                args: '--new-project',
                description: 'Create a new project.'
            },
            { type: 'separator' },
            {
                type: 'task',
                title: 'Recover Project',
                program: process.execPath,
                args: '--recover-project',
                description: 'Recover Project'
            }
        ]
    }
])