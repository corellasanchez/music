import { Menu } from 'electron'

export function buildMenu(app, win){


const menu = Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        {
          label: 'Inicio',
          click() {
            win.webContents.send('navigate', '/');
          }
        },
        {
          label: 'Configuracion',
          click() {
            win.webContents.send('navigate', '/config');
          }
        },
        {
          label: 'Anuncios de texto',
          click() {
            win.webContents.send('navigate', '/messages');
          }
        },
        {
          label: 'Publicidad',
          click() {
            win.webContents.send('navigate', '/banners');
          }
        },
        {
          label: 'Usuarios Administrativos',
          click() {
            win.webContents.send('navigate', '/admin_users');
          }
        },
        {
          label: 'Salir',
          click() {
            app.quit()
          }
        },
      ],
    }, {
      label: "Editar",
      submenu: [
        { label: "Deshacer", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Rehacer", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cortar", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copiar", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Pegar", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Seleccionar Todo", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
      ]
    },
    {
      label: "Ventana",
      submenu: [
        {
          label: 'Mover ventana',
          click() {
            win.setFullScreen(false);
          }
        },
        {
          label: 'Pantalla Completa',
          click() {
            win.maximize();
            win.setFullScreen(true);
          }
        }
      ]
    }
  ]);

  Menu.setApplicationMenu(menu);
  win.setMenuBarVisibility(true);
  win.maximize();
  win.setFullScreen(true);
  win.setMenuBarVisibility(false);
}