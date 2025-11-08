"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  Printer,
  Maximize2
} from "lucide-react";
import { PdfControlsProps } from "./types";

export default function PdfControls({
  currentPage,
  totalPages,
  zoom,
  onPageChange,
  onZoomChange,
  onDownload,
  onPrint,
  fileUrl
}: PdfControlsProps) {
  const iconButtonClass =
    "rounded-full border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/15";
  const actionButtonClass =
    "rounded-full border-white/15 bg-gradient-to-r from-white/10 via-white/5 to-transparent text-white hover:from-white/20 hover:via-white/10";

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleZoomIn = () => {
    onZoomChange(Math.min(zoom + 0.25, 3.0));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoom - 0.25, 0.5));
  };

  const handleZoomFit = () => {
    onZoomChange(1.0);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-white/5 px-4 py-5 text-white backdrop-blur">
      {/* Page Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className={iconButtonClass}
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 min-w-[120px] justify-center">
          <span className="text-sm font-semibold tracking-wide">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <Button
          variant="outline"
          size="icon"
          className={iconButtonClass}
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className={iconButtonClass}
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>

        <div className="min-w-[80px] text-center">
          <span className="text-sm font-semibold tracking-wide">{Math.round(zoom * 100)}%</span>
        </div>

        <Button
          variant="outline"
          size="icon"
          className={iconButtonClass}
          onClick={handleZoomIn}
          disabled={zoom >= 3.0}
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className={iconButtonClass}
          onClick={handleZoomFit}
          title="Fit to width"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className={actionButtonClass}
          onClick={onDownload}
          title="Download PDF"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>

        <Button
          variant="outline"
          size="sm"
          className={actionButtonClass}
          onClick={onPrint}
          title="Print PDF"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>
    </div>
  );
}
