"use client";

import PdfViewer from "./index";

/**
 * Example usage of PdfViewer component for IRS Publication 946
 *
 * This component demonstrates how to use the PDF viewer to display
 * "How To Depreciate Property - IRS Publication 946" (p946.pdf)
 *
 * Usage:
 * Import this component in your page:
 *
 * ```tsx
 * import PdfViewerExample from "@/components/Tools/pdf-viewer/example";
 *
 * export default function Page() {
 *   return (
 *     <div className="h-screen">
 *       <PdfViewerExample />
 *     </div>
 *   );
 * }
 * ```
 */
export default function PdfViewerExample() {
  return (
    <div className="h-screen w-full">
      <PdfViewer
        fileUrl="/p946.pdf"
        title="How To Depreciate Property - IRS Publication 946"
        initialPage={1}
        initialZoom={1.0}
      />
    </div>
  );
}
