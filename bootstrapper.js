/**
 * Created by Saron on 2015/9/28.
 */
var app = require('app');  // Module to control application life.

//require('electron-debug')();
var BrowserWindow = require('browser-window');  // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start();
//require('express').start('http://localhost:3000/',function(){});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {

    // when program startup, first to create a local authorization file
    // through this file.the program can charge the permission of the user to use de program
    //fileManager.createFile(config.authorizationPath);

    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600});

    // and load the index.html of the app.
    //mainWindow.loadUrl('http://localhost:3000');
    mainWindow.loadUrl('file://' + __dirname + '/app/core/home/home.html');

    // Open the DevTools.
    mainWindow.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});
