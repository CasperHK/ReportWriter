'use client';

import { useState } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DocumentEntry {
  id: string;
  title: string;
}

interface ReferenceEntry {
  id: string;
  label: string;
  authors: string;
  year: number;
}

// ---------------------------------------------------------------------------
// Placeholder data — replace with real store/IPC calls in future iterations.
// ---------------------------------------------------------------------------

const PLACEHOLDER_DOCUMENTS: DocumentEntry[] = [
  { id: 'doc-1', title: 'Thesis Chapter 1' },
  { id: 'doc-2', title: 'Research Proposal' },
];

const PLACEHOLDER_REFERENCES: ReferenceEntry[] = [
  { id: 'ref-1', label: 'Smith et al., 2021', authors: 'Smith, J.', year: 2021 },
  { id: 'ref-2', label: 'Doe & Lee, 2023', authors: 'Doe, A.; Lee, B.', year: 2023 },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SidebarItem({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full truncate rounded-md px-3 py-1.5 text-left text-sm transition-colors',
        isActive
          ? 'bg-indigo-600 text-white'
          : 'text-neutral-300 hover:bg-neutral-800 hover:text-white',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

function ExportToolbar() {
  async function handleExportPDF() {
    if (typeof window === 'undefined' || !window.electronAPI) return;
    const result = await window.electronAPI.exportToPDF();
    if (result.success) {
      console.info('PDF saved to', result.path);
    } else {
      console.warn('PDF export failed:', result.reason);
    }
  }

  return (
    <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-900 px-4 py-2 print:hidden">
      <span className="mr-2 text-sm font-medium text-neutral-400">Export:</span>
      <button
        type="button"
        onClick={handleExportPDF}
        className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-indigo-500 active:bg-indigo-700"
      >
        PDF
      </button>
      <button
        type="button"
        className="rounded-md bg-neutral-700 px-3 py-1 text-xs font-medium text-neutral-200 transition-colors hover:bg-neutral-600"
      >
        Word (.docx)
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const [activeDocId, setActiveDocId] = useState<string>(
    PLACEHOLDER_DOCUMENTS[0]?.id ?? '',
  );

  const activeDocument = PLACEHOLDER_DOCUMENTS.find((d) => d.id === activeDocId);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100">
      {/* ----------------------------------------------------------------- */}
      {/* Sidebar                                                            */}
      {/* ----------------------------------------------------------------- */}
      <aside className="flex w-56 shrink-0 flex-col border-r border-neutral-800 bg-neutral-900 print:hidden">
        {/* App branding */}
        <div className="flex h-12 items-center border-b border-neutral-800 px-4">
          <span className="text-sm font-bold tracking-tight text-white">
            📝 Report Writer
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 pt-4">
          <SidebarSection title="Documents">
            {PLACEHOLDER_DOCUMENTS.map((doc) => (
              <SidebarItem
                key={doc.id}
                label={doc.title}
                isActive={doc.id === activeDocId}
                onClick={() => setActiveDocId(doc.id)}
              />
            ))}
          </SidebarSection>

          <SidebarSection title="References">
            {PLACEHOLDER_REFERENCES.map((ref) => (
              <div
                key={ref.id}
                className="rounded-md px-3 py-1.5 text-xs text-neutral-400"
              >
                <span className="block truncate font-medium text-neutral-300">
                  {ref.label}
                </span>
                <span className="truncate">{ref.authors}</span>
              </div>
            ))}
          </SidebarSection>
        </nav>

        {/* Footer */}
        <div className="border-t border-neutral-800 p-3 text-xs text-neutral-600">
          v0.1.0
        </div>
      </aside>

      {/* ----------------------------------------------------------------- */}
      {/* Main workspace                                                     */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <ExportToolbar />

        {/* Editor area */}
        <main className="flex-1 overflow-y-auto bg-neutral-950 p-8">
          <div className="mx-auto max-w-3xl">
            {/* Document title */}
            <h1 className="mb-6 text-2xl font-bold text-white">
              {activeDocument?.title ?? 'Untitled Document'}
            </h1>

            {/* Editor placeholder — Tiptap or Lexical mounts here */}
            <div
              className="min-h-[60vh] rounded-lg border border-neutral-800 bg-neutral-900 p-6 text-neutral-400 print:border-none print:bg-white print:text-black"
              aria-label="Document editor workspace"
            >
              <p className="text-sm">
                Editor workspace — Tiptap / Lexical will be initialized here.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
