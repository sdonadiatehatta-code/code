// Utility for processing and rendering uploaded PDF, Word (.docx), or image letterheads
import { renderAsync } from 'docx-preview';
import { toPng } from 'html-to-image';
import { PDFDocument } from 'pdf-lib';
import mammoth from 'mammoth';

export interface ProcessedLetterheadResult {
  dataUrl: string;
  pdfBytesBase64: string;
  previewImageUrl: string;
  type: 'pdf' | 'word' | 'image';
  wordBytesBase64?: string;
}

/**
 * Process a PDF Letterhead file
 */
export async function processLetterheadPdfFile(file: File): Promise<ProcessedLetterheadResult> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // Convert to Base64
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const pdfBytesBase64 = btoa(binary);
  const dataUrl = `data:application/pdf;base64,${pdfBytesBase64}`;

  // Try to render the first page to image using pdfjs-dist if available
  let previewImageUrl = '';
  try {
    const pdfjs = await import('pdfjs-dist');
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
    }
    const loadingTask = pdfjs.getDocument({ data: bytes });
    const pdfDoc = await loadingTask.promise;
    const page = await pdfDoc.getPage(1);

    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // @ts-ignore
      await page.render({ canvasContext: ctx, viewport }).promise;
      previewImageUrl = canvas.toDataURL('image/png');
    }
  } catch (err) {
    console.warn('Could not render PDF preview using pdfjs-dist, using fallback', err);
    previewImageUrl = dataUrl;
  }

  return {
    dataUrl,
    pdfBytesBase64,
    previewImageUrl: previewImageUrl || dataUrl,
    type: 'pdf',
  };
}

/**
 * Process a Word Document (.docx / .doc) Letterhead file,
 * rendering it to an image and converting it into a standard A4 PDF letterhead.
 */
export async function processLetterheadWordFile(file: File): Promise<ProcessedLetterheadResult> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const wordBytesBase64 = btoa(binary);
  const dataUrl = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${wordBytesBase64}`;

  // Create an off-screen container for rendering
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = '794px'; // Standard A4 width at 96 DPI
  container.style.minHeight = '1123px'; // Standard A4 height
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#000000';
  container.style.padding = '36px 48px';
  container.style.fontFamily = 'Georgia, serif';
  container.style.boxSizing = 'border-box';
  container.style.zIndex = '-1000';
  document.body.appendChild(container);

  let previewImageUrl = '';

  try {
    // Primary approach: Render using docx-preview for high layout fidelity
    try {
      await renderAsync(arrayBuffer, container, undefined, {
        inWrapper: false,
        ignoreWidth: true,
        ignoreHeight: true,
        renderHeaders: true,
        renderFooters: true,
      });
    } catch (docxErr) {
      console.warn('docx-preview failed, attempting mammoth fallback', docxErr);
      // Fallback approach: Mammoth converts to HTML with embedded images
      const mammothResult = await mammoth.convertToHtml({ arrayBuffer });
      container.innerHTML = mammothResult.value;
    }

    // Wait for any images inside the container to load
    const images = Array.from(container.querySelectorAll('img'));
    await Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    // Convert the rendered container to high-res PNG image
    previewImageUrl = await toPng(container, {
      quality: 0.95,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
    });
  } catch (renderErr) {
    console.error('Error generating image from Word document:', renderErr);
    // In extreme fallback, create a simple canvas with document title
    const canvas = document.createElement('canvas');
    canvas.width = 794;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 16px Georgia';
      ctx.textAlign = 'center';
      ctx.fillText(file.name.replace(/\.[^/.]+$/, ''), canvas.width / 2, 80);
      previewImageUrl = canvas.toDataURL('image/png');
    }
  } finally {
    // Always clean up off-screen DOM element
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }

  // Convert the rendered preview image into an official A4 PDF using pdf-lib
  let pdfBytesBase64 = '';
  try {
    const pdfDoc = await PDFDocument.create();
    const a4WidthPt = 595.28;
    const a4HeightPt = 841.89;
    const page = pdfDoc.addPage([a4WidthPt, a4HeightPt]);

    if (previewImageUrl && previewImageUrl.startsWith('data:image/png;base64,')) {
      const pngImage = await pdfDoc.embedPng(previewImageUrl);
      const imgDims = pngImage.scaleToFit(a4WidthPt, a4HeightPt);

      page.drawImage(pngImage, {
        x: (a4WidthPt - imgDims.width) / 2,
        y: a4HeightPt - imgDims.height,
        width: imgDims.width,
        height: imgDims.height,
      });

      const pdfBytes = await pdfDoc.save();
      let pdfBinary = '';
      const pLen = pdfBytes.byteLength;
      for (let i = 0; i < pLen; i++) {
        pdfBinary += String.fromCharCode(pdfBytes[i]);
      }
      pdfBytesBase64 = btoa(pdfBinary);
    }
  } catch (pdfErr) {
    console.warn('Could not generate PDF from Word letterhead image:', pdfErr);
  }

  return {
    dataUrl,
    wordBytesBase64,
    pdfBytesBase64,
    previewImageUrl: previewImageUrl || dataUrl,
    type: 'word',
  };
}

/**
 * Universal processor for any uploaded Letterhead (PDF, Word .docx/.doc, or Image)
 */
export async function processUniversalLetterheadFile(file: File): Promise<ProcessedLetterheadResult> {
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return processLetterheadPdfFile(file);
  }

  if (
    fileName.endsWith('.docx') ||
    fileName.endsWith('.doc') ||
    fileType.includes('word') ||
    fileType.includes('officedocument')
  ) {
    return processLetterheadWordFile(file);
  }

  if (fileType.startsWith('image/')) {
    const dataUrl = await fileToDataUrl(file);
    return {
      dataUrl,
      pdfBytesBase64: '',
      previewImageUrl: dataUrl,
      type: 'image',
    };
  }

  // Default to Word processor if unknown text/binary format, else PDF
  try {
    return await processLetterheadWordFile(file);
  } catch {
    return processLetterheadPdfFile(file);
  }
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
