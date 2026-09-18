import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from 'pdf-lib';
import { LetterDocument, LetterheadAsset, SignatureAsset } from '../types';
import { getAshokaStambhPngDataUrl } from '../components/AshokaStambh';

// Helper to convert data URL to Uint8Array
export function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1];
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Convert SVG data URL to PNG data URL via browser canvas
export async function svgDataUrlToPngDataUrl(svgDataUrl: string, width = 800, height = 200): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(svgDataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (err) => {
      console.error('Failed to rasterize SVG for PDF', err);
      reject(err);
    };
    img.src = svgDataUrl;
  });
}

// Helper to split text into lines that fit within a maximum width
function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const paragraphs = text.split('\n');
  const allLines: string[] = [];

  for (const para of paragraphs) {
    if (para.trim() === '') {
      allLines.push('');
      continue;
    }

    const words = para.split(' ');
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine === '' ? word : `${currentLine} ${word}`;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine !== '') {
          allLines.push(currentLine);
        }
        currentLine = word;
      }
    }

    if (currentLine !== '') {
      allLines.push(currentLine);
    }
  }

  return allLines;
}

export async function generateOfficialLetterPdf(
  doc: LetterDocument,
  letterhead?: LetterheadAsset | null,
  signature?: SignatureAsset | null
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // A4 Page Size in points: 595.28 x 841.89
  const PAGE_WIDTH = 595.28;
  const PAGE_HEIGHT = 841.89;

  // Convert mm to points (1 mm = 2.83465 points)
  const MM_TO_PT = 2.83465;
  const leftMargin = (doc.formatting.margins?.left ?? 25) * MM_TO_PT;
  const rightMargin = (doc.formatting.margins?.right ?? 20) * MM_TO_PT;
  const topMargin = (doc.formatting.margins?.top ?? 25) * MM_TO_PT;
  const bottomMargin = (doc.formatting.margins?.bottom ?? 25) * MM_TO_PT;
  const contentWidth = PAGE_WIDTH - leftMargin - rightMargin;

  // Embed standard government fonts
  let mainFont: PDFFont;
  let boldFont: PDFFont;
  let italicFont: PDFFont;

  if (doc.formatting.fontFamily === 'arial') {
    mainFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  } else {
    // Default to Times-Roman for authentic government letter look
    mainFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    italicFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  }

  const fontSize = doc.formatting.fontSize || 12;
  const lineHeight = fontSize * (doc.formatting.lineSpacing || 1.35);

  const pages: PDFPage[] = [];
  let currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  pages.push(currentPage);

  // If uploaded letterhead is a PDF, embed page 0 on the first page
  let hasLetterheadPdf = false;
  if (letterhead && (letterhead.type === 'pdf' || (letterhead.type === 'word' && letterhead.pdfBytesBase64))) {
    try {
      let pdfBytes: Uint8Array;
      if (letterhead.pdfBytesBase64) {
        const bin = atob(letterhead.pdfBytesBase64);
        pdfBytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) pdfBytes[i] = bin.charCodeAt(i);
      } else {
        pdfBytes = dataUrlToUint8Array(letterhead.dataUrl);
      }
      const loadedLhDoc = await PDFDocument.load(pdfBytes);
      const [embeddedLhPage] = await pdfDoc.embedPdf(loadedLhDoc, [0]);
      currentPage.drawPage(embeddedLhPage, {
        x: 0,
        y: 0,
        width: PAGE_WIDTH,
        height: PAGE_HEIGHT,
      });
      hasLetterheadPdf = true;
    } catch (e) {
      console.warn('Could not embed letterhead PDF directly, attempting image fallback', e);
    }
  }

  if (!hasLetterheadPdf && letterhead && (letterhead.previewImageUrl || letterhead.dataUrl)) {
    // Embed letterhead image at the top
    try {
      let imgData = letterhead.previewImageUrl || letterhead.dataUrl;
      if (imgData.startsWith('data:image/svg+xml')) {
        imgData = await svgDataUrlToPngDataUrl(imgData, 1200, 200);
      }
      if (imgData.startsWith('data:image/')) {
        const bytes = dataUrlToUint8Array(imgData);
        let embeddedImg;
        if (imgData.includes('image/png')) {
          embeddedImg = await pdfDoc.embedPng(bytes);
        } else {
          embeddedImg = await pdfDoc.embedJpg(bytes);
        }
        const imgDims = embeddedImg.scale(contentWidth / embeddedImg.width);
        currentPage.drawImage(embeddedImg, {
          x: leftMargin,
          y: PAGE_HEIGHT - topMargin - imgDims.height + 15,
          width: contentWidth,
          height: imgDims.height,
        });
      }
    } catch (err) {
      console.warn('Could not embed letterhead image', err);
    }
  }

  // Determine starting Y coordinate (start close to top if letterhead is present)
  let currentY = doc.letterheadConfig ? PAGE_HEIGHT - 6 * 2.83465 : PAGE_HEIGHT - topMargin;

  if (doc.letterheadConfig) {
    const lh = doc.letterheadConfig;

    // 1. Uploaded Emblem (if not uploaded, keep space empty)
    if (lh.emblemDataUrl) {
      try {
        let imgData = lh.emblemDataUrl;
        if (imgData.startsWith('data:image/svg+xml')) {
          imgData = await svgDataUrlToPngDataUrl(imgData, 800, 800);
        }
        const imgBytes = dataUrlToUint8Array(imgData);
        let embeddedImg;
        if (imgData.includes('image/png')) {
          embeddedImg = await pdfDoc.embedPng(imgBytes);
        } else {
          embeddedImg = await pdfDoc.embedJpg(imgBytes);
        }
        const maxH = 36;
        const maxW = 120;
        const scale = Math.min(1, maxH / embeddedImg.height, maxW / embeddedImg.width);
        const embWidth = embeddedImg.width * scale;
        const embHeight = embeddedImg.height * scale;
        currentPage.drawImage(embeddedImg, {
          x: (PAGE_WIDTH - embWidth) / 2,
          y: currentY - embHeight,
          width: embWidth,
          height: embHeight,
        });
        currentY -= embHeight + 4;
      } catch (err) {
        console.warn('Could not embed emblem in PDF', err);
      }
    }

    // 2. Letter head text lines (skip empty lines)
    const activeLines = [lh.line1, lh.line2, lh.line3, lh.line4]
      .map((l) => (l ? l.trim() : ''))
      .filter(Boolean);

    for (let i = 0; i < activeLines.length; i++) {
      const line = activeLines[i];
      const sz = i === 0 ? fontSize + 1.5 : i === 1 ? fontSize + 0.5 : fontSize - 0.5;
      const textWidth = boldFont.widthOfTextAtSize(line, sz);
      currentPage.drawText(line, {
        x: (PAGE_WIDTH - textWidth) / 2,
        y: currentY,
        size: sz,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      currentY -= sz * 1.25;
    }

    // 3. Email ID and Telephone of the office
    const emailVal = lh.email?.trim();
    const telVal = lh.telephone?.trim();

    if (emailVal && telVal) {
      const sz = fontSize - 2.5;
      const emailText = `Email: ${emailVal}`;
      const telText = `Tel: ${telVal}`;
      const telWidth = mainFont.widthOfTextAtSize(telText, sz);

      // Email on left side of the line
      currentPage.drawText(emailText, {
        x: leftMargin,
        y: currentY,
        size: sz,
        font: mainFont,
        color: rgb(0.15, 0.15, 0.15),
      });

      // Telephone on right side of the line
      currentPage.drawText(telText, {
        x: PAGE_WIDTH - rightMargin - telWidth,
        y: currentY,
        size: sz,
        font: mainFont,
        color: rgb(0.15, 0.15, 0.15),
      });

      currentY -= sz * 1.3;
    } else if (emailVal || telVal) {
      // Only one of the two is filled -> draw at centre
      const sz = fontSize - 2.5;
      const singleText = emailVal ? `Email: ${emailVal}` : `Tel: ${telVal}`;
      const textWidth = mainFont.widthOfTextAtSize(singleText, sz);

      currentPage.drawText(singleText, {
        x: (PAGE_WIDTH - textWidth) / 2,
        y: currentY,
        size: sz,
        font: mainFont,
        color: rgb(0.15, 0.15, 0.15),
      });

      currentY -= sz * 1.3;
    }

    // 4. Black Bold Line divider before memo number and body start
    currentY -= 4;
    currentPage.drawLine({
      start: { x: leftMargin, y: currentY },
      end: { x: PAGE_WIDTH - rightMargin, y: currentY },
      thickness: 2.2,
      color: rgb(0, 0, 0),
    });
    currentY -= 14;
  } else if (hasLetterheadPdf || letterhead) {
    const offsetPt = (doc.formatting.letterheadTopOffsetMm || 42) * MM_TO_PT;
    currentY = PAGE_HEIGHT - offsetPt;
  } else {
    // Render standard government text header if no letterhead
    if (doc.officeName) {
      const officeLines = doc.officeName.split('\n');
      for (const line of officeLines) {
        const textWidth = boldFont.widthOfTextAtSize(line, fontSize + 1);
        const textX = (PAGE_WIDTH - textWidth) / 2;
        currentPage.drawText(line, {
          x: textX,
          y: currentY,
          size: fontSize + 1,
          font: boldFont,
          color: rgb(0.05, 0.15, 0.1),
        });
        currentY -= lineHeight;
      }
    }
    if (doc.department) {
      const textWidth = boldFont.widthOfTextAtSize(doc.department, fontSize - 1);
      currentPage.drawText(doc.department, {
        x: (PAGE_WIDTH - textWidth) / 2,
        y: currentY,
        size: fontSize - 1,
        font: boldFont,
        color: rgb(0.1, 0.2, 0.15),
      });
      currentY -= lineHeight;
    }
    if (doc.officeAddress) {
      const textWidth = mainFont.widthOfTextAtSize(doc.officeAddress, fontSize - 2);
      currentPage.drawText(doc.officeAddress, {
        x: (PAGE_WIDTH - textWidth) / 2,
        y: currentY,
        size: fontSize - 2,
        font: mainFont,
        color: rgb(0.2, 0.25, 0.3),
      });
      currentY -= lineHeight;
    }
    if (doc.contactInfo) {
      const textWidth = mainFont.widthOfTextAtSize(doc.contactInfo, fontSize - 2.5);
      currentPage.drawText(doc.contactInfo, {
        x: (PAGE_WIDTH - textWidth) / 2,
        y: currentY,
        size: fontSize - 2.5,
        font: mainFont,
        color: rgb(0.3, 0.35, 0.4),
      });
      currentY -= lineHeight;
    }

    // Divider line
    currentY -= 4;
    currentPage.drawLine({
      start: { x: leftMargin, y: currentY },
      end: { x: PAGE_WIDTH - rightMargin, y: currentY },
      thickness: 1,
      color: rgb(0.2, 0.25, 0.2),
    });
    currentY -= 14;
  }

  // Function to create a new page if needed
  function checkPageBreak(requiredHeight: number) {
    if (currentY - requiredHeight < bottomMargin) {
      currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      pages.push(currentPage);
      currentY = PAGE_HEIGHT - topMargin;

      // Draw continuation header
      const continuationText = `[ Continuation Sheet - Memo No: ${doc.memoNo || '---'} ]`;
      currentPage.drawText(continuationText, {
        x: leftMargin,
        y: currentY,
        size: 9,
        font: italicFont,
        color: rgb(0.4, 0.45, 0.5),
      });

      const pageNumStr = `Page ${pages.length}`;
      const pageNumWidth = italicFont.widthOfTextAtSize(pageNumStr, 9);
      currentPage.drawText(pageNumStr, {
        x: PAGE_WIDTH - rightMargin - pageNumWidth,
        y: currentY,
        size: 9,
        font: italicFont,
        color: rgb(0.4, 0.45, 0.5),
      });

      currentY -= 18;
    }
  }

  // 1. Memo No. and Date row
  checkPageBreak(lineHeight * 2);
  const memoText = `Memo No. ${doc.memoNo || '[Memo No.]'}`;
  currentPage.drawText(memoText, {
    x: leftMargin,
    y: currentY,
    size: fontSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  const dateText = doc.date
    ? doc.date.toLowerCase().startsWith('dated')
      ? doc.date
      : `Dated: ${doc.date}`
    : 'Dated: [Date]';
  const dateWidth = boldFont.widthOfTextAtSize(dateText, fontSize);
  currentPage.drawText(dateText, {
    x: PAGE_WIDTH - rightMargin - dateWidth,
    y: currentY,
    size: fontSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  currentY -= lineHeight * 1.5;

  // 2. To Address Block
  checkPageBreak(lineHeight * 5);
  currentPage.drawText(doc.toPrefix || 'To', {
    x: leftMargin,
    y: currentY,
    size: fontSize,
    font: mainFont,
    color: rgb(0, 0, 0),
  });
  currentY -= lineHeight;

  const toLines = [
    doc.toName,
    doc.toDesignation || (!doc.toName && !doc.toOffice ? '[Recipient Designation / Name]' : ''),
    doc.toOffice,
    doc.toAddress || (!doc.toName && !doc.toOffice ? '[Office / Address]' : ''),
  ].filter(Boolean);

  for (const line of toLines) {
    checkPageBreak(lineHeight);
    currentPage.drawText(line, {
      x: leftMargin + 14,
      y: currentY,
      size: fontSize,
      font: line === doc.toDesignation || line === doc.toName ? boldFont : mainFont,
      color: rgb(0, 0, 0),
    });
    currentY -= lineHeight;
  }
  currentY -= lineHeight * 0.5;

  // 3. Subject
  checkPageBreak(lineHeight * 2);
  const subLabel = 'Sub: ';
  const labelWidth = boldFont.widthOfTextAtSize(subLabel, fontSize);
  const subjectContent = doc.subject || '[Subject]';

  const subWrappedLines = wrapText(
    subjectContent,
    doc.formatting.subjectStyle?.bold ? boldFont : mainFont,
    fontSize,
    contentWidth - labelWidth - 8
  );

  for (let i = 0; i < subWrappedLines.length; i++) {
    checkPageBreak(lineHeight);
    if (i === 0) {
      currentPage.drawText(subLabel, {
        x: leftMargin + 14,
        y: currentY,
        size: fontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
    }
    currentPage.drawText(subWrappedLines[i], {
      x: leftMargin + 14 + labelWidth,
      y: currentY,
      size: fontSize,
      font: doc.formatting.subjectStyle?.bold ? boldFont : mainFont,
      color: rgb(0, 0, 0),
    });

    // Underline if required
    if (doc.formatting.subjectStyle?.underline) {
      const textW = (doc.formatting.subjectStyle?.bold ? boldFont : mainFont).widthOfTextAtSize(
        subWrappedLines[i],
        fontSize
      );
      currentPage.drawLine({
        start: { x: leftMargin + 14 + labelWidth, y: currentY - 1.5 },
        end: { x: leftMargin + 14 + labelWidth + textW, y: currentY - 1.5 },
        thickness: 0.8,
        color: rgb(0, 0, 0),
      });
    }

    currentY -= lineHeight;
  }
  currentY -= lineHeight * 0.4;

  // 4. Reference
  if (doc.reference) {
    checkPageBreak(lineHeight * 2);
    const refLabel = 'Ref: ';
    const labelWidth = boldFont.widthOfTextAtSize(refLabel, fontSize - 1);
    const refLines = wrapText(doc.reference, italicFont, fontSize - 1, contentWidth - labelWidth - 8);

    for (let i = 0; i < refLines.length; i++) {
      checkPageBreak(lineHeight);
      if (i === 0) {
        currentPage.drawText(refLabel, {
          x: leftMargin + 14,
          y: currentY,
          size: fontSize - 1,
          font: boldFont,
          color: rgb(0.1, 0.1, 0.1),
        });
      }
      currentPage.drawText(refLines[i], {
        x: leftMargin + 14 + labelWidth,
        y: currentY,
        size: fontSize - 1,
        font: italicFont,
        color: rgb(0.1, 0.1, 0.1),
      });
      currentY -= lineHeight;
    }
    currentY -= lineHeight * 0.4;
  }

  // 5. Salutation
  if (doc.salutation) {
    checkPageBreak(lineHeight * 1.5);
    currentPage.drawText(doc.salutation, {
      x: leftMargin,
      y: currentY,
      size: fontSize,
      font: mainFont,
      color: rgb(0, 0, 0),
    });
    currentY -= lineHeight * 1.3;
  }

  // 6. Body Paragraphs
  const rawParagraphs = doc.body.split('\n\n').filter((p) => p.trim());
  const paragraphs =
    rawParagraphs.length > 0
      ? rawParagraphs
      : ['[Official Letter Body — Enter instructions to draft with AI or edit in Structured Fields]'];

  for (const para of paragraphs) {
    const wrappedLines = wrapText(para, mainFont, fontSize, contentWidth);
    for (const line of wrappedLines) {
      checkPageBreak(lineHeight);
      currentPage.drawText(line, {
        x: leftMargin,
        y: currentY,
        size: fontSize,
        font: mainFont,
        color: rgb(0, 0, 0),
      });
      currentY -= lineHeight;
    }
    // Paragraph spacing
    currentY -= (doc.formatting.paragraphSpacing || 10) * 0.75;
  }

  // 7. Closing & Signature block
  // Reserve space for signature image + name + designation (approx 120 points)
  checkPageBreak(130);
  currentY -= lineHeight * 0.5;

  if (doc.closing) {
    const closingWidth = mainFont.widthOfTextAtSize(doc.closing, fontSize);
    const closingX = PAGE_WIDTH - rightMargin - Math.max(closingWidth, 180);
    currentPage.drawText(doc.closing, {
      x: closingX,
      y: currentY,
      size: fontSize,
      font: mainFont,
      color: rgb(0, 0, 0),
    });
    currentY -= lineHeight * 1.2;
  }

  // Embed Signature Image if provided
  if (signature && signature.dataUrl) {
    try {
      let sigData = signature.dataUrl;
      if (sigData.startsWith('data:image/svg+xml')) {
        sigData = await svgDataUrlToPngDataUrl(sigData, 400, 120);
      }
      const bytes = dataUrlToUint8Array(sigData);
      let embeddedSig;
      if (sigData.includes('image/png')) {
        embeddedSig = await pdfDoc.embedPng(bytes);
      } else {
        embeddedSig = await pdfDoc.embedJpg(bytes);
      }

      const scaleFactor = ((doc.formatting.signatureScale || 90) / 100) * 0.35;
      const sigWidth = embeddedSig.width * scaleFactor;
      const sigHeight = embeddedSig.height * scaleFactor;

      const baseSigX = PAGE_WIDTH - rightMargin - sigWidth - 20;
      const sigX = baseSigX + (doc.formatting.signatureOffsetX || 0);
      const sigY = currentY - sigHeight + (doc.formatting.signatureOffsetY || 0);

      currentPage.drawImage(embeddedSig, {
        x: Math.max(leftMargin, Math.min(PAGE_WIDTH - rightMargin - sigWidth, sigX)),
        y: sigY,
        width: sigWidth,
        height: sigHeight,
      });

      currentY -= sigHeight + 4;
    } catch (e) {
      console.warn('Failed to embed signature into PDF', e);
      currentY -= 35;
    }
  } else {
    currentY -= 35; // Space for physical signature
  }

  // Signatory Name & Designation Block
  const designationLines = [
    doc.signatoryDesignationLine1,
    doc.signatoryDesignationLine2,
    doc.signatoryDesignationLine3,
    doc.signatoryDesignationLine4,
  ].some((l) => l !== undefined)
    ? [
        doc.signatoryDesignationLine1,
        doc.signatoryDesignationLine2,
        doc.signatoryDesignationLine3,
        doc.signatoryDesignationLine4,
      ]
        .map((l) => l?.trim())
        .filter((l): l is string => Boolean(l))
    : (doc.signatoryDesignation?.trim() ? [doc.signatoryDesignation.trim()] : []);

  const sigBlockLines: string[] = [];
  if (doc.signatoryName?.trim()) {
    sigBlockLines.push(`(${doc.signatoryName.trim()})`);
  }
  for (const desig of designationLines) {
    sigBlockLines.push(desig);
  }
  if (doc.signatoryOffice?.trim() && !designationLines.includes(doc.signatoryOffice.trim())) {
    sigBlockLines.push(doc.signatoryOffice.trim());
  }

  for (const line of sigBlockLines) {
    checkPageBreak(lineHeight);
    const lineWidth = boldFont.widthOfTextAtSize(line, fontSize);
    const lineX = PAGE_WIDTH - rightMargin - Math.max(lineWidth, 180);
    currentPage.drawText(line, {
      x: lineX,
      y: currentY,
      size: fontSize,
      font: line.startsWith('(') ? boldFont : mainFont,
      color: rgb(0, 0, 0),
    });
    currentY -= lineHeight;
  }
  currentY -= lineHeight * 0.8;

  // 8. Enclosures
  if (doc.enclosures && doc.enclosures.length > 0) {
    checkPageBreak(lineHeight * (doc.enclosures.length + 1));
    currentPage.drawText('Enclosures:', {
      x: leftMargin,
      y: currentY,
      size: fontSize,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    currentY -= lineHeight;

    for (const enc of doc.enclosures) {
      checkPageBreak(lineHeight);
      currentPage.drawText(enc, {
        x: leftMargin + 10,
        y: currentY,
        size: fontSize - 1,
        font: mainFont,
        color: rgb(0, 0, 0),
      });
      currentY -= lineHeight;
    }
    currentY -= lineHeight * 0.5;
  }

  // 9. Copy To (Distribution List)
  if (doc.copyTo && doc.copyTo.length > 0) {
    checkPageBreak(lineHeight * (doc.copyTo.length + 2));
    const copyDateText = doc.date
      ? doc.date.toLowerCase().startsWith('dated')
        ? doc.date
        : `Dated: ${doc.date}`
      : 'Dated: [Date]';
    const copyHeading = `Memo No. ${doc.memoNo ? `${doc.memoNo}/1(${doc.copyTo.length})` : '[Memo No.]/1(...) '}    ${copyDateText}`;
    currentPage.drawText(copyHeading, {
      x: leftMargin,
      y: currentY,
      size: fontSize,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    currentY -= lineHeight;

    currentPage.drawText('Copy forwarded for information and taking necessary action to:', {
      x: leftMargin,
      y: currentY,
      size: fontSize,
      font: mainFont,
      color: rgb(0, 0, 0),
    });
    currentY -= lineHeight;

    for (const copy of doc.copyTo) {
      checkPageBreak(lineHeight);
      currentPage.drawText(copy, {
        x: leftMargin + 10,
        y: currentY,
        size: fontSize - 1,
        font: mainFont,
        color: rgb(0, 0, 0),
      });
      currentY -= lineHeight;
    }

    // Endorsement Signatory space
    currentY -= lineHeight * 2;
    const endoLine = designationLines.length > 0 ? designationLines[0] : (doc.signatoryDesignation?.trim() || '');
    if (endoLine) {
      const endoWidth = boldFont.widthOfTextAtSize(endoLine, fontSize);
      currentPage.drawText(endoLine, {
        x: PAGE_WIDTH - rightMargin - Math.max(endoWidth, 180),
        y: currentY,
        size: fontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
    }
  }

  // Add final page numbers on all pages (e.g. Page 1 of 2)
  const totalPages = pages.length;
  for (let i = 0; i < totalPages; i++) {
    const page = pages[i];
    const footerText = `Page ${i + 1} of ${totalPages}`;
    const textWidth = italicFont.widthOfTextAtSize(footerText, 8.5);
    page.drawText(footerText, {
      x: (PAGE_WIDTH - textWidth) / 2,
      y: bottomMargin / 2,
      size: 8.5,
      font: italicFont,
      color: rgb(0.4, 0.45, 0.5),
    });
  }

  return await pdfDoc.save();
}
