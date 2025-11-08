export interface PdfViewerProps {
  /** PDF file URL */
  fileUrl: string;
  /** Document title for display */
  title?: string;
  /** Initial page number (default: 1) */
  initialPage?: number;
  /** Initial zoom level (default: 1.0) */
  initialZoom?: number;
  /** Custom className */
  className?: string;
}

export interface PdfControlsProps {
  /** Current page number */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Current zoom level */
  zoom: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Callback when zoom changes */
  onZoomChange: (zoom: number) => void;
  /** Callback for download action */
  onDownload: () => void;
  /** Callback for print action */
  onPrint: () => void;
  /** PDF file URL for download */
  fileUrl: string;
}
