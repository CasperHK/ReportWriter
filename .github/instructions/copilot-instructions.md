# GitHub Copilot Instructions for Report Writer

You are an expert AI assistant specializing in Electron, Next.js (App Router), TypeScript, and Rich Text Editors (Tiptap/Lexical). Your role is to help develop "Report Writer," a specialized desktop application for writing structured documents with managed citations and multi-format exports.

---

## 🏗️ Project Architecture & Rules

This project is built using `electron-vite` and Next.js. You must respect the separation of concerns between the processes:

1. **Main Process (`src/main/`)**: Node.js and Native OS APIs environment.
   - Use Node.js `fs`, `path`, and Electron `dialog`, `BrowserWindow`, `ipcMain`.
   - Never import frontend framework components here.
2. **Preload Script (`src/preload/`)**: The security bridge.
   - Use `contextBridge.exposeInMainWorld` to expose APIs securely.
   - Do **NOT** expose raw `ipcRenderer` or Node modules directly. Always wrap actions in explicit functions (e.g., `exportToPDF: () => ipcRenderer.invoke('export-pdf')`).
3. **Renderer Process (`src/renderer/`)**: Frontend UI environment (Next.js Static Export).
   - Driven by Next.js App Router with `output: 'export'`.
   - **No Server-Side Rendering (SSR)**. All components must be client-safe (`"use client"` where state or hooks are used).
   - Native/Node operations must be called via `window.electronAPI.*`.

---

## 🎨 Code Style & Tech Stack Guidelines

### TypeScript & Linting
- Write strictly typed, modern TypeScript. Avoid `any` types; prefer creating proper `interface` or `type` contracts.
- Use functional programming patterns and React hooks where appropriate.

### Frontend UI (Next.js + Tailwind CSS)
- Style components with utility-first Tailwind CSS.
- Ensure all text-editor templates consider `@media print` rules for the PDF Export layout (e.g., handling page-breaks properly via `print:break-inside-avoid`).

### Rich Text Editor & Data Format
- Assume **Tiptap** as the core editor engine.
- Document state is stored as a structured JSON object (`content` node tree + discrete `citations` object tracking sources).
- When writing components for the editor, ensure custom Nodes (like `CitationNode`) are serializable.

---

## ⚙️ Core Feature Implementation Guidelines

### 1. Citation & Reference System
- Bibliography data follows a structure compatible with standard citation engines (e.g., CSL-JSON or BibTeX).
- When writing code related to citations, separate the database management (CRUD) from the text-editor node rendering.

### 2. PDF Export Engine (`src/main/index.ts`)
- PDF compilation is handled by Electron's native `webContents.printToPDF()`.
- Set default printing options to:
  ```typescript
  {
    marginsType: 0, // default margins
    printBackground: true, // must be true to retain background styles and colors
    pageSize: 'A4'
  }
  ```
- Always wrap file writing operations (`fs.writeFileSync`) in `try/catch` and use `dialog.showSaveDialog` for secure location picking.

### 3. Word Document (.docx) Generation
- Use the `docx` package for generating `.docx` binary buffers.
- Map the editor JSON structure directly to `docx` components (`Paragraph`, `TextRun`, `Table`). Avoid dangerous direct HTML-to-Word hacks.

---

## 🔒 Security Best Practices

- **Context Isolation**: Always keep `contextIsolation: true` and `nodeIntegration: false` in `BrowserWindow` options.
- **IPC Validation**: In `ipcMain.handle`, always validate incoming parameters before processing file mutations or external network requests.
