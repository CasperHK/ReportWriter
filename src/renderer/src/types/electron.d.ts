/**
 * Global type augmentation for the contextBridge API injected by
 * src/preload/index.ts into every renderer page.
 *
 * Keep in sync with the object shape passed to
 * contextBridge.exposeInMainWorld('electronAPI', …).
 */

type ExportResult =
  | { success: true; path: string }
  | { success: false; reason: string };

interface ElectronAPI {
  /** Trigger a native PDF export via Electron's printToPDF engine. */
  exportToPDF: () => Promise<ExportResult>;

  /**
   * Save a base64-encoded .docx buffer to disk.
   * @param base64Buffer - Output of docx.Packer.toBase64String(doc)
   */
  saveWordFile: (base64Buffer: string) => Promise<ExportResult>;

  /** Open a previously saved file in the OS default application. */
  openFile: (filePath: string) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
