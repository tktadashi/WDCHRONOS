
const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: './public/clock-icon.png', // Aqui vai o seu ícone de relógio!
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Se você já fez o build do projeto:
  win.loadFile('dist/index.html'); 
  win.setMenu(null);


}

app.whenReady().then(createWindow);
