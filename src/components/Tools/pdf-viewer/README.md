# PDF Viewer Component

A feature-rich PDF viewer component for Next.js built with react-pdf.

## Features

- ✅ Page navigation (previous/next)
- ✅ Zoom controls (zoom in/out/fit to width)
- ✅ Download PDF
- ✅ Print PDF
- ✅ Responsive design
- ✅ Loading and error states
- ✅ TypeScript support

## Installation

Dependencies are already installed:
- `react-pdf` - PDF rendering library
- `pdfjs-dist` - PDF.js core library

## Usage

### Basic Example

```tsx
import PdfViewer from "@/components/Tools/pdf-viewer";

export default function MyPage() {
  return (
    <div className="h-screen">
      <PdfViewer
        fileUrl="/p946.pdf"
        title="How To Depreciate Property - IRS Publication 946"
      />
    </div>
  );
}
```

### With Custom Options

```tsx
import PdfViewer from "@/components/Tools/pdf-viewer";

export default function MyPage() {
  return (
    <div className="h-screen">
      <PdfViewer
        fileUrl="/path/to/document.pdf"
        title="My Document"
        initialPage={1}
        initialZoom={1.2}
        className="custom-class"
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fileUrl` | `string` | required | URL to the PDF file |
| `title` | `string` | `"PDF Document"` | Document title for display |
| `initialPage` | `number` | `1` | Initial page number to display |
| `initialZoom` | `number` | `1.0` | Initial zoom level (0.5 to 3.0) |
| `className` | `string` | `undefined` | Additional CSS classes |

## Controls

- **Navigation**: Use the left/right arrow buttons or keyboard arrows to navigate pages
- **Zoom**:
  - Click +/- buttons to zoom in/out
  - Click the maximize button to fit to width
  - Zoom range: 50% to 300%
- **Download**: Click the Download button to save the PDF
- **Print**: Click the Print button to open the browser print dialog

## File Structure

```
src/components/Tools/pdf-viewer/
├── index.tsx          # Main PDF viewer component
├── PdfControls.tsx    # Control bar component
├── types.ts           # TypeScript type definitions
└── README.md          # This file
```

## Example: IRS Publication 946

```tsx
<PdfViewer
  fileUrl="/p946.pdf"
  title="How To Depreciate Property - IRS Publication 946"
  initialPage={1}
  initialZoom={1.0}
/>
```

## Notes

- The component uses PDF.js CDN for the worker file
- Text layer and annotation layer are enabled by default
- The component is fully responsive and works on mobile devices
- Error handling is built-in with user-friendly messages

## Troubleshooting

### PDF not loading
- Ensure the PDF file exists in the `public` folder
- Check the browser console for CORS errors
- Verify the file URL is correct

### Styling issues
- The component uses Tailwind CSS classes
- Ensure your Next.js project has Tailwind configured
- The component imports required CSS from react-pdf

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support
