'use client';

import { useMemo, useState } from 'react';

interface DocumentEntry {
  id: string;
  title: string;
  subtitle: string;
  updatedAt: string;
}

interface ReferenceEntry {
  id: string;
  label: string;
  source: string;
  year: number;
}

type PageFormat = 'A4' | 'Letter';

const PAGE_PRESETS: Record<PageFormat, { widthMm: number; heightMm: number }> = {
  A4: { widthMm: 210, heightMm: 297 },
  Letter: { widthMm: 216, heightMm: 279 },
};

const PLACEHOLDER_DOCUMENTS: DocumentEntry[] = [
  {
    id: 'doc-1',
    title: 'Nanomaterial Diffusion Study',
    subtitle: 'Methods and early observations',
    updatedAt: 'Updated 2h ago',
  },
  {
    id: 'doc-2',
    title: 'Public Policy Draft',
    subtitle: 'Impact summary and recommendations',
    updatedAt: 'Updated yesterday',
  },
  {
    id: 'doc-3',
    title: 'Conference Abstract',
    subtitle: 'Comparative learning outcomes',
    updatedAt: 'Updated 3 days ago',
  },
];

const PLACEHOLDER_REFERENCES: ReferenceEntry[] = [
  {
    id: 'ref-1',
    label: 'Fernandez et al.',
    source: 'Journal of Materials Systems',
    year: 2024,
  },
  {
    id: 'ref-2',
    label: 'Kline and Zhou',
    source: 'Computational Dynamics Review',
    year: 2023,
  },
  {
    id: 'ref-3',
    label: 'National Lab Report 77',
    source: 'Federal Research Archive',
    year: 2022,
  },
];

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-7">
      <h2 className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-chrome-300">
        {title}
      </h2>
      {children}
    </section>
  );
}

function DocumentCard({
  document,
  isActive,
  onClick,
}: {
  document: DocumentEntry;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'mb-2 w-full rounded-panel border px-3 py-2.5 text-left transition-all duration-200',
        isActive
          ? 'border-accent-500 bg-accent-700/95 text-parchment-50 shadow-panel'
          : 'border-chrome-700 bg-chrome-800/75 text-parchment-100 hover:-translate-y-0.5 hover:border-accent-300 hover:bg-chrome-700/80',
      ].join(' ')}
    >
      <p className="truncate text-sm font-semibold">{document.title}</p>
      <p className="truncate pt-0.5 text-xs text-parchment-200/95">{document.subtitle}</p>
      <p className="pt-2 text-[11px] uppercase tracking-wider text-parchment-200/75">
        {document.updatedAt}
      </p>
    </button>
  );
}

function FormatSegment({
  value,
  activeFormat,
  onChange,
}: {
  value: PageFormat;
  activeFormat: PageFormat;
  onChange: (format: PageFormat) => void;
}) {
  const active = value === activeFormat;

  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={[
        'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200',
        active
          ? 'bg-accent-600 text-parchment-50 shadow-ring'
          : 'text-ink-700 hover:bg-parchment-100',
      ].join(' ')}
    >
      {value}
    </button>
  );
}

function ExportActions() {
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
    <div className="flex items-center gap-2 print:hidden">
      <button
        type="button"
        onClick={handleExportPDF}
        className="rounded-lg bg-accent-600 px-3 py-1.5 text-xs font-semibold text-parchment-50 transition-all duration-200 hover:bg-accent-700"
      >
        Export PDF
      </button>
      <button
        type="button"
        className="rounded-lg border border-chrome-300 bg-parchment-50 px-3 py-1.5 text-xs font-semibold text-ink-700 transition-all duration-200 hover:border-accent-300 hover:text-accent-700"
      >
        Export Word
      </button>
    </div>
  );
}

function PaperPreview({
  title,
  pageFormat,
  bodyText,
  onBodyTextChange,
}: {
  title: string;
  pageFormat: PageFormat;
  bodyText: string;
  onBodyTextChange: (value: string) => void;
}) {
  const pagePreset = PAGE_PRESETS[pageFormat];

  const paperStyle = useMemo(
    () =>
      ({
        '--paper-width': `${pagePreset.widthMm}mm`,
        '--paper-height': `${pagePreset.heightMm}mm`,
      }) as React.CSSProperties,
    [pagePreset.heightMm, pagePreset.widthMm],
  );

  return (
    <div className="paper-sheet fade-in-up" style={paperStyle}>
      <article className="report-paper min-h-full rounded-[1.6rem] border border-[#dbceb9] bg-[#fffdf9] px-8 pb-14 pt-10 shadow-paper print:rounded-none print:border-none print:bg-white print:px-0 print:pt-0 print:shadow-none sm:px-12">
        <div className="mb-5 inline-flex rounded-full border border-[#dfd2be] bg-[#fef5e8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-500">
          Paper Preview Area
        </div>

        <header className="mb-10 border-b border-[#ece1cf] pb-7">
          <p className="font-body text-[11px] uppercase tracking-[0.22em] text-ink-300">
            Report Writer Draft
          </p>
          <h1 className="mt-2 font-display text-4xl leading-tight sm:text-[2.65rem]">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] text-ink-500">
            This paper-first surface mirrors your export output. Rich text and citation nodes can be mounted here, including inline and display equations rendered with KaTeX.
          </p>
        </header>

        <section className="print:break-inside-avoid">
          <h2 className="text-[1.78rem]">Executive Summary</h2>
          <p className="mt-4 text-[15px] text-ink-700">
            The editorial layout uses a fixed paper rhythm so you can assess structure while writing. Navigation and controls stay outside the sheet, while the document itself remains clean and export-aligned.
          </p>

          <div className="mt-5 rounded-xl border border-[#e5d9c7] bg-[#fff9f0] p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-500">
              Editable Area
            </p>
            <textarea
              value={bodyText}
              onChange={(event) => onBodyTextChange(event.target.value)}
              className="mt-2 min-h-52 w-full resize-y rounded-lg border border-[#ddcfbb] bg-white px-3 py-3 text-[15px] text-ink-800 outline-none transition-shadow focus:shadow-ring"
              aria-label="Editable report content"
            />
          </div>
        </section>

        <section className="mt-9 print:break-inside-avoid">
          <h2 className="text-[1.78rem]">Methods</h2>
          <p className="mt-4 text-[15px] text-ink-700">
            Equation blocks should avoid splitting across pages. KaTeX display nodes will use dedicated spacing and overflow behavior.
          </p>
          <div className="katex-display rounded-xl border border-[#ebe0ce] bg-[#fcf5ea] px-4 py-3 text-[15px] text-ink-700">
            Example equation placeholder: F = ma, E = mc^2, and integral terms can be rendered with KaTeX in this section.
          </div>
        </section>

        <section className="mt-9">
          <h2 className="text-[1.78rem]">References</h2>
          <ul className="mt-4 space-y-2 text-[14px] text-ink-700">
            {PLACEHOLDER_REFERENCES.map((entry) => (
              <li key={entry.id}>
                {entry.label} ({entry.year}). {entry.source}.
              </li>
            ))}
          </ul>
        </section>
      </article>
    </div>
  );
}

export default function DashboardPage() {
  const [activeDocId, setActiveDocId] = useState<string>(
    PLACEHOLDER_DOCUMENTS[0]?.id ?? '',
  );
  const [pageFormat, setPageFormat] = useState<PageFormat>('A4');
  const [bodyText, setBodyText] = useState<string>(
    'Type your report content here. This block is the editable surface that will later be replaced by Tiptap or Lexical.',
  );

  const activeDocument =
    PLACEHOLDER_DOCUMENTS.find((entry) => entry.id === activeDocId) ??
    PLACEHOLDER_DOCUMENTS[0];

  return (
    <div className="editorial-shell flex h-screen w-screen overflow-hidden text-ink-900">
      <aside className="fade-in-soft flex w-72 shrink-0 border-r border-chrome-700 bg-chrome-900 px-4 py-5 text-parchment-50 print:hidden md:w-80 md:flex-col">
        <div className="mb-7 border-b border-chrome-700 pb-4">
          <p className="mb-2 inline-flex rounded-full border border-chrome-300/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-parchment-100/80">
            App UI
          </p>
          <p className="font-body text-[11px] uppercase tracking-[0.28em] text-parchment-200/75">
            Studio
          </p>
          <p className="mt-1 font-display text-3xl leading-none">Report Writer</p>
          <p className="mt-2 text-xs text-parchment-200/80">
            Editorial drafting workspace
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto pr-1">
          <SidebarSection title="Documents">
            {PLACEHOLDER_DOCUMENTS.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                isActive={doc.id === activeDocId}
                onClick={() => setActiveDocId(doc.id)}
              />
            ))}
          </SidebarSection>

          <SidebarSection title="Quick Sources">
            {PLACEHOLDER_REFERENCES.map((entry) => (
              <div
                key={entry.id}
                className="mb-2 rounded-xl border border-chrome-700/80 bg-chrome-800/65 px-3 py-2"
              >
                <p className="truncate text-xs font-semibold text-parchment-100">
                  {entry.label}
                </p>
                <p className="truncate text-[11px] text-parchment-200/80">
                  {entry.source}
                </p>
              </div>
            ))}
          </SidebarSection>
        </nav>

        <p className="mt-4 border-t border-chrome-700 pt-3 text-[11px] uppercase tracking-[0.22em] text-parchment-200/70">
          Version 0.1.0
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="fade-in-soft flex flex-wrap items-center justify-between gap-3 border-b border-[#dbcdb8] bg-parchment-50/85 px-4 py-3 backdrop-blur print:hidden sm:px-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ink-500">Current Draft</p>
            <h1 className="font-display text-3xl leading-none text-ink-900 sm:text-[2.2rem]">
              {activeDocument.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-xl border border-[#deceb8] bg-[#f6ecdd] p-1">
              <FormatSegment
                value="A4"
                activeFormat={pageFormat}
                onChange={setPageFormat}
              />
              <FormatSegment
                value="Letter"
                activeFormat={pageFormat}
                onChange={setPageFormat}
              />
            </div>

            <ExportActions />
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:px-8">
          <div className="grid min-h-full grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
            <section className="rounded-panel border border-[#d9cbb6]/85 bg-[#f5ebdb]/68 p-4 shadow-panel sm:p-6">
              <PaperPreview
                title={activeDocument.title}
                pageFormat={pageFormat}
                bodyText={bodyText}
                onBodyTextChange={setBodyText}
              />
            </section>

            <aside className="fade-in-up hidden rounded-panel border border-[#d9c8af] bg-[#f7efdf]/82 p-4 xl:block xl:p-5 print:hidden">
              <h2 className="font-display text-[1.72rem] text-ink-900">Context Panel</h2>
              <p className="mt-2 text-sm text-ink-700">
                Keep outline, citations, and assistant notes here while preserving a distraction-light paper view.
              </p>

              <div className="mt-5 rounded-2xl border border-[#e4d6c0] bg-[#fff8ed] p-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-ink-500">Status</p>
                <p className="mt-1 text-sm font-semibold text-ink-900">Ready for equation insertion</p>
                <p className="mt-2 text-xs text-ink-600">
                  KaTeX blocks will inherit paper spacing and avoid broken page splits.
                </p>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
