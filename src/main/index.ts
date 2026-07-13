import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ExportPDFPayload {
  /** Optional pre-set save path; if omitted a save dialog is shown. */
  savePath?: string;
}

interface SaveDocxPayload {
  /** Base64-encoded .docx buffer produced by the renderer. */
  buffer: string;
  /** Optional pre-set save path; if omitted a save dialog is shown. */
  savePath?: string;
}

function resolveWindowIconPath(): string | undefined {
  const candidates = [
    path.join(app.getAppPath(), 'build', 'icon.png'),
    path.join(process.cwd(), 'build', 'icon.png'),
  ];

  return candidates.find((iconPath) => fs.existsSync(iconPath));
}

// ---------------------------------------------------------------------------
// Window factory
// ---------------------------------------------------------------------------

function createWindow(): BrowserWindow {
  const icon = resolveWindowIconPath();

  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,
    ...(icon ? { icon } : {}),
    webPreferences: {
      // Security: always keep context isolation on and node integration off.
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, '../preload/index.js'),
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (process.env['NODE_ENV'] === 'development') {
    // In development the renderer is served by the Next.js dev server.
    mainWindow.loadURL('http://localhost:3100');
    mainWindow.webContents.openDevTools();
  } else {
    // In production load the statically exported Next.js output.
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  return mainWindow;
}

// ---------------------------------------------------------------------------
// IPC Handlers
// ---------------------------------------------------------------------------

/**
 * Exports the current document to a PDF file using Electron's native
 * webContents.printToPDF() API.
 */
ipcMain.handle('export-pdf', async (event, payload: ExportPDFPayload = {}) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) throw new Error('No BrowserWindow found for sender.');

  const savePath =
    payload.savePath ??
    (
      await dialog.showSaveDialog(win, {
        title: 'Save PDF',
        defaultPath: 'document.pdf',
        filters: [{ name: 'PDF Document', extensions: ['pdf'] }],
      })
    ).filePath;

  if (!savePath) return { success: false, reason: 'cancelled' };

  try {
    const pdfData = await win.webContents.printToPDF({
      marginsType: 0,
      printBackground: true,
      pageSize: 'A4',
    });
    fs.writeFileSync(savePath, pdfData);
    return { success: true, path: savePath };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, reason: message };
  }
});

/**
 * Saves a base64-encoded .docx buffer produced by the `docx` library in the
 * renderer to a file chosen by the user.
 */
ipcMain.handle('save-docx', async (event, payload: SaveDocxPayload) => {
  if (typeof payload?.buffer !== 'string') {
    throw new Error('Invalid payload: expected a base64 buffer string.');
  }

  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) throw new Error('No BrowserWindow found for sender.');

  const savePath =
    payload.savePath ??
    (
      await dialog.showSaveDialog(win, {
        title: 'Save Word Document',
        defaultPath: 'document.docx',
        filters: [{ name: 'Word Document', extensions: ['docx'] }],
      })
    ).filePath;

  if (!savePath) return { success: false, reason: 'cancelled' };

  try {
    const buffer = Buffer.from(payload.buffer, 'base64');
    fs.writeFileSync(savePath, buffer);
    return { success: true, path: savePath };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, reason: message };
  }
});

/**
 * Opens the saved file in the OS default handler (e.g. PDF viewer / Word).
 */
ipcMain.handle('open-file', async (_event, filePath: string) => {
  if (typeof filePath !== 'string') {
    throw new Error('Invalid payload: expected a file path string.');
  }
  await shell.openPath(filePath);
});

// ---------------------------------------------------------------------------
// App lifecycle
// ---------------------------------------------------------------------------

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
