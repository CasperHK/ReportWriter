# 📝 Report Writer

An elegant, desktop-first academic and professional report writing application built with Electron and Next.js. Create perfectly formatted documents with robust reference management, and export seamlessly to PDF, Word, or web pages.

---

## ✨ Features

- **🚀 Hybrid Desktop Architecture**: Powered by Electron for native OS integration and Next.js (App Router) for an agile web interface.
- **📚 Smart Citation & Reference System**: Manage bibliographies effortlessly. Insert in-text citations with `@` shortcuts and automatically generate APA/IEEE-compliant reference lists at the end.
- **🖨️ Advanced Export Engine**:
  - **PDF Export**: Pixel-perfect layout preservation matching professional print standards (`@media print` CSS integration).
  - **Word Document (.docx)**: Dynamic JSON-to-Word rendering ensuring clean heading styles and editable tables.
  - **Export to Web**: Compile standalone HTML files or publish to the cloud with one click.
- **📐 Formula & Code Support**: Full integration with **KaTeX** for beautiful mathematical rendering and syntax highlighting for technical reports.
- **💾 Offline-First**: Keep data secure locally with native file system access via Electron's Secure Inter-Process Communication (IPC).

---

## 🛠️ Tech Stack

- **Shell / Window Management**: [Electron](https://electronjs.org) & [Electron-Vite](https://electron-vite.org)
- **Frontend / Routing**: [Next.js](https://nextjs.org) (Static HTML Export `output: 'export'`)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Text Editor Core**: [Tiptap Editor](https://tiptap.dev) / [Lexical](https://lexical.dev)
- **Document Compilers**:
  - `docx.js` for Word Generation
  - Native `webContents.printToPDF()` for PDF Engine

---

## 📂 Project Structure

```text
report-writer/
├── src/
│   ├── main/                  # Electron Main Process (Node.js/Native APIs)
│   │   ├── index.ts           # Window management, file handlers, PDF compiler
│   │   └── tsconfig.json
│   ├── preload/               # Electron Preload Script (Security Bridge)
│   │   └── index.ts           # Safe APIs exposed to Next.js renderer
│   └── renderer/              # Electron Renderer Process (Next.js App)
│       ├── src/
│       │   ├── app/           # Next.js App Router (UI Components & Pages)
│       │   ├── components/    # Editor Workspace, Citation Panel, Export Menu
│       │   └── styles/        # CSS print directives
│       ├── next.config.mjs    # Static export configurations
│       └── tailwind.config.js
├── package.json
└── electron-vite.config.ts    # Consolidated dev/build toolchain configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org) installed (v18 or higher recommended).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com
   cd report-writer
   ```

2. Install dependecies:
   ```bash
   npm install
   ```

### Development

Run the application in development mode with hot-reloading:
```bash
npm run dev
```

### Building / Packaging

To build and package the desktop app for production:

```bash
# Build for current OS
npm run build

# Target specific operating systems
npm run build:win
npm run build:mac
npm run build:linux
```

---

## 💡 Architecture & Implementation Highlights

### 1. Static Export Configuration (`next.config.mjs`)
Because Electron hosts assets locally via `file://`, server-side components (SSR) are disabled. The renderer outputs purely static files:
```javascript
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
};
export default nextConfig;
```

### 2. Secure Native Bridge (`src/preload/index.ts`)
To prevent security vulnerabilities, malicious renderer scripts cannot call node libraries directly. We bridge the environment securely:
```typescript
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  exportToPDF: () => ipcRenderer.invoke('export-pdf'),
  saveWordFile: (buffer) => ipcRenderer.invoke('save-docx', buffer)
})
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
