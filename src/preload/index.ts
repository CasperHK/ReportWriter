import { contextBridge, ipcRenderer } from 'electron';

// ---------------------------------------------------------------------------
// Type contracts — kept in sync with src/renderer/src/types/electron.d.ts
// ---------------------------------------------------------------------------

type ExportResult =
  | { success: true; path: string }
  | { success: false; reason: string };

// ---------------------------------------------------------------------------
// Secure bridge
//
// Rules (from copilot-instructions.md):
//  ✓ Use contextBridge.exposeInMainWorld
//  ✓ Never expose raw ipcRenderer or Node modules
//  ✓ Wrap every action in an explicit, typed function
// ---------------------------------------------------------------------------

contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Trigger a native PDF export.  Electron's main process calls
   * webContents.printToPDF() and saves the result via a save dialog.
   */
  exportToPDF: (): Promise<ExportResult> =>
    ipcRenderer.invoke('export-pdf'),

  /**
   * Save a base64-encoded .docx buffer produced by the `docx` library in the
   * renderer.  The main process decodes it and writes it to disk.
   */
  saveWordFile: (base64Buffer: string): Promise<ExportResult> =>
    ipcRenderer.invoke('save-docx', { buffer: base64Buffer }),

  /**
   * Open a previously saved file in the OS default handler.
   */
  openFile: (filePath: string): Promise<void> =>
    ipcRenderer.invoke('open-file', filePath),
});
