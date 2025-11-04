/**
 * Calendar export utilities for PDF and image generation
 */

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Export calendar element as PDF
 */
export async function exportCalendarAsPDF(
  elementId: string,
  filename: string = "mondkalender.pdf"
): Promise<void> {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      backgroundColor: "#e8e8e8",
    });

    // Get canvas dimensions
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF({
      orientation: imgHeight > imgWidth ? "portrait" : "landscape",
      unit: "mm",
      format: "a4",
    });

    // Add image to PDF
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    // Save PDF
    pdf.save(filename);
  } catch (error) {
    console.error("PDF export error:", error);
    throw new Error("Failed to export PDF");
  }
}

/**
 * Export calendar element as PNG image
 */
export async function exportCalendarAsImage(
  elementId: string,
  filename: string = "mondkalender.png"
): Promise<void> {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      backgroundColor: "#e8e8e8",
    });

    // Convert canvas to blob (wrapped in Promise for proper error handling)
    await new Promise<void>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to create image blob"));
          return;
        }

        try {
          // Create download link
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = filename;
          link.click();

          // Cleanup
          URL.revokeObjectURL(url);
          resolve();
        } catch (error) {
          reject(error);
        }
      }, "image/png");
    });
  } catch (error) {
    console.error("Image export error:", error);
    throw new Error("Failed to export image");
  }
}

/**
 * Export calendar with options dialog
 */
export async function exportCalendarWithOptions(
  elementId: string,
  monthName: string,
  year: number
): Promise<void> {
  const format = await showExportDialog();

  if (!format) {
    return; // User cancelled
  }

  const filename = `mondkalender-${monthName}-${year}.${format}`;

  if (format === "pdf") {
    await exportCalendarAsPDF(elementId, filename);
  } else {
    await exportCalendarAsImage(elementId, filename);
  }
}

/**
 * Show export format selection dialog
 */
function showExportDialog(): Promise<"pdf" | "png" | null> {
  return new Promise((resolve) => {
    const result = window.confirm(
      "Möchten Sie als PDF exportieren?\n\nOK = PDF\nAbbrechen = PNG Bild"
    );

    if (result === null) {
      resolve(null); // User closed dialog
    } else if (result) {
      resolve("pdf");
    } else {
      resolve("png");
    }
  });
}
