"use client";

import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { cn } from "@/lib/utils";
import PdfControls from "./PdfControls";
import { PdfViewerProps } from "./types";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfViewer({
  fileUrl,
  title = "PDF Document",
  initialPage = 1,
  initialZoom = 1.0,
  className
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(initialPage);
  const [zoom, setZoom] = useState<number>(initialZoom);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error("Error loading PDF:", error);
    setError("Failed to load PDF document. Please try again.");
    setIsLoading(false);
  }, []);

  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = title.replace(/\s+/g, "_") + ".pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [fileUrl, title]);

  const handlePrint = useCallback(() => {
    const printWindow = window.open(fileUrl, "_blank");
    if (printWindow) {
      printWindow.addEventListener("load", () => {
        printWindow.print();
      });
    }
  }, [fileUrl]);

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-[2rem] border border-white/15 bg-slate-950/70 text-white shadow-[0_25px_120px_rgba(6,8,30,0.55)] backdrop-blur-2xl",
        className
      )}
    >
      {/* Header */}
      <div className="relative border-b border-white/10 px-6 py-5">
        <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60" />
        <div className="relative flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">IRS reference</p>
              <h2 className="text-lg font-semibold leading-snug text-white">{title}</h2>
            </div>
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
              PDF
            </span>
          </div>
          <p className="text-sm text-white/60">
            Navigate, zoom, or export the official publication without leaving your workspace.
          </p>
        </div>
      </div>

      {/* Controls */}
      {!isLoading && !error && (
        <PdfControls
          currentPage={pageNumber}
          totalPages={numPages}
          zoom={zoom}
          onPageChange={setPageNumber}
          onZoomChange={setZoom}
          onDownload={handleDownload}
          onPrint={handlePrint}
          fileUrl={fileUrl}
        />
      )}

      {/* PDF Content */}
      <div className="flex-1 overflow-auto">
        <div className="relative min-h-[420px] bg-gradient-to-b from-slate-900/30 via-slate-950/40 to-slate-950/70 p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),_transparent_60%)]" />
          <div className="relative mx-auto flex max-w-[640px] justify-center">
            {isLoading && (
              <div className="flex min-h-[420px] flex-col items-center justify-center space-y-4 text-white/70">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/20 border-t-blue-300" />
                <p className="text-sm font-medium tracking-wide">Fetching PDF...</p>
                <p className="text-xs text-white/50">This may take a second depending on your connection.</p>
              </div>
            )}

            {error && (
              <div className="flex min-h-[420px] flex-col items-center justify-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-400/40 bg-red-500/10 text-red-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold text-white">We could not load the PDF</p>
                  <p className="text-sm text-white/70">{error}</p>
                </div>
              </div>
            )}

            {!error && (
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={null}
                className="flex flex-col items-center"
              >
                <Page
                  pageNumber={pageNumber}
                  scale={zoom}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className="rounded-2xl border border-white/10 shadow-[0_25px_80px_rgba(2,6,23,0.55)]"
                />
              </Document>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      {!isLoading && !error && (
        <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-white/60">
          <p>
            Use the controls above to navigate, zoom, download, or print this document. All interactions stay
            synced with your depreciation workflow.
          </p>
        </div>
      )}
    </div>
  );
}

// Export component name for display
export { PdfViewer };
