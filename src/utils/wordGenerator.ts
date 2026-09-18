import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  AlignmentType,
  UnderlineType,
  convertMillimetersToTwip,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from 'docx';
import { LetterDocument, LetterheadAsset, SignatureAsset } from '../types';
import { getAshokaStambhPngDataUrl } from '../components/AshokaStambh';

export async function generateOfficialLetterDocx(
  doc: LetterDocument,
  letterhead?: LetterheadAsset | null,
  signature?: SignatureAsset | null
): Promise<Blob> {
  const topMarginTwips = convertMillimetersToTwip(
    doc.letterheadConfig ? 6 : (doc.formatting.margins?.top ?? 25)
  );
  const bottomMarginTwips = convertMillimetersToTwip(doc.formatting.margins?.bottom ?? 25);
  const leftMarginTwips = convertMillimetersToTwip(doc.formatting.margins?.left ?? 25);
  const rightMarginTwips = convertMillimetersToTwip(doc.formatting.margins?.right ?? 20);

  const fontName =
    doc.formatting.fontFamily === 'arial'
      ? 'Arial'
      : doc.formatting.fontFamily === 'georgia'
      ? 'Georgia'
      : 'Times New Roman';

  const defaultFontSizeHalfPoints = (doc.formatting.fontSize || 12) * 2; // docx uses half-points (24 = 12pt)

  const paragraphs: (Paragraph | Table)[] = [];

  // 0. Official Letterhead
  if (doc.letterheadConfig) {
    const lh = doc.letterheadConfig;

    // 0.1 Uploaded Emblem (if not uploaded, keep space empty)
    if (lh.emblemDataUrl) {
      try {
        const imgData = lh.emblemDataUrl;
        const commaIdx = imgData.indexOf(',');
        if (commaIdx !== -1) {
          const base64Data = imgData.substring(commaIdx + 1);
          const binary = atob(base64Data);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

          paragraphs.push(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 60, before: 0 },
              children: [
                new ImageRun({
                  data: bytes,
                  transformation: {
                    width: 48,
                    height: 48,
                  },
                } as any),
              ],
            })
          );
        }
      } catch (err) {
        console.warn('Could not embed emblem in Word document:', err);
      }
    }

    // 0.2 Non-empty text lines
    const activeLines = [lh.line1, lh.line2, lh.line3, lh.line4]
      .map((l) => (l ? l.trim() : ''))
      .filter(Boolean);

    for (let i = 0; i < activeLines.length; i++) {
      const line = activeLines[i];
      const sz =
        i === 0
          ? defaultFontSizeHalfPoints + 4
          : i === 1
          ? defaultFontSizeHalfPoints + 2
          : defaultFontSizeHalfPoints;
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40, before: 0 },
          children: [
            new TextRun({
              text: line,
              bold: true,
              font: fontName,
              size: sz,
            }),
          ],
        })
      );
    }

    // 0.3 Email and Telephone
    const emailVal = lh.email?.trim();
    const telVal = lh.telephone?.trim();

    if (emailVal && telVal) {
      paragraphs.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
            bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
            left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
            right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
            insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'auto' },
            insideVertical: { style: BorderStyle.NONE, size: 0, color: 'auto' },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                    bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                    left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                    right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.LEFT,
                      children: [
                        new TextRun({
                          text: `Email: ${emailVal}`,
                          font: fontName,
                          size: defaultFontSizeHalfPoints - 4,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                    bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                    left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                    right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      children: [
                        new TextRun({
                          text: `Tel: ${telVal}`,
                          font: fontName,
                          size: defaultFontSizeHalfPoints - 4,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
      );
    } else if (emailVal || telVal) {
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60, before: 30 },
          children: [
            new TextRun({
              text: emailVal ? `Email: ${emailVal}` : `Tel: ${telVal}`,
              font: fontName,
              size: defaultFontSizeHalfPoints - 4,
            }),
          ],
        })
      );
    }

    // 0.4 Black Bold Line divider before memo number and body start
    paragraphs.push(
      new Paragraph({
        border: {
          bottom: {
            color: '000000',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 18, // bold 2.25pt line
          },
        },
        spacing: { after: 180, before: 40 },
      })
    );
  } else if (letterhead && (letterhead.previewImageUrl || letterhead.dataUrl)) {
    try {
      const imgUrl = letterhead.previewImageUrl || letterhead.dataUrl;
      if (imgUrl.startsWith('data:image/')) {
        const base64Data = imgUrl.split(',')[1];
        const binary = atob(base64Data);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

        paragraphs.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new ImageRun({
                data: bytes,
                transformation: {
                  width: 580,
                  height: 110,
                },
              } as any),
            ],
          })
        );
      }
    } catch (e) {
      console.warn('Could not embed letterhead image in Word document:', e);
    }
  }

  // 1. Memo No. and Date row
  const memoText = doc.memoNo ? `Memo No. ${doc.memoNo}` : 'Memo No. [Memo No.]';
  const dateText = doc.date ? `Dated: ${doc.date}` : 'Dated: [Date]';

  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.BOTH,
      spacing: { after: 280, before: 100 },
      children: [
        new TextRun({
          text: memoText,
          bold: true,
          font: fontName,
          size: defaultFontSizeHalfPoints,
        }),
        new TextRun({
          text: '\t\t\t\t\t\t' + dateText,
          bold: true,
          font: fontName,
          size: defaultFontSizeHalfPoints,
        }),
      ],
    })
  );

  // 2. Recipient Block ("To", Designation, Office, Address)
  paragraphs.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: doc.toPrefix || 'To',
          bold: true,
          font: fontName,
          size: defaultFontSizeHalfPoints,
        }),
      ],
    })
  );

  if (doc.toName) {
    paragraphs.push(
      new Paragraph({
        indent: { left: convertMillimetersToTwip(12) },
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: doc.toName,
            font: fontName,
            size: defaultFontSizeHalfPoints,
          }),
        ],
      })
    );
  }

  if (doc.toDesignation) {
    paragraphs.push(
      new Paragraph({
        indent: { left: convertMillimetersToTwip(12) },
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: doc.toDesignation,
            bold: true,
            font: fontName,
            size: defaultFontSizeHalfPoints,
          }),
        ],
      })
    );
  }

  if (doc.toOffice) {
    paragraphs.push(
      new Paragraph({
        indent: { left: convertMillimetersToTwip(12) },
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: doc.toOffice,
            font: fontName,
            size: defaultFontSizeHalfPoints,
          }),
        ],
      })
    );
  }

  if (doc.toAddress) {
    const addrLines = doc.toAddress.split('\n');
    for (const line of addrLines) {
      if (line.trim()) {
        paragraphs.push(
          new Paragraph({
            indent: { left: convertMillimetersToTwip(12) },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: line.trim(),
                font: fontName,
                size: defaultFontSizeHalfPoints,
              }),
            ],
          })
        );
      }
    }
  }

  // 3. Subject Line (Bold and Underlined)
  if (doc.subject) {
    paragraphs.push(
      new Paragraph({
        indent: { left: convertMillimetersToTwip(12) },
        spacing: { before: 200, after: 120 },
        children: [
          new TextRun({
            text: 'Sub: ',
            bold: true,
            font: fontName,
            size: defaultFontSizeHalfPoints,
          }),
          new TextRun({
            text: doc.subject,
            bold: true,
            underline: {
              type: UnderlineType.SINGLE,
            },
            font: fontName,
            size: defaultFontSizeHalfPoints,
          }),
        ],
      })
    );
  }

  // 4. Reference Line
  if (doc.reference) {
    paragraphs.push(
      new Paragraph({
        indent: { left: convertMillimetersToTwip(12) },
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: 'Ref: ',
            bold: true,
            font: fontName,
            size: defaultFontSizeHalfPoints,
          }),
          new TextRun({
            text: doc.reference,
            italics: true,
            font: fontName,
            size: defaultFontSizeHalfPoints,
          }),
        ],
      })
    );
  }

  // 5. Salutation
  paragraphs.push(
    new Paragraph({
      spacing: { before: 140, after: 140 },
      children: [
        new TextRun({
          text: doc.salutation || 'Sir,',
          font: fontName,
          size: defaultFontSizeHalfPoints,
        }),
      ],
    })
  );

  // 6. Body Paragraphs
  const bodyText = doc.body || '[Letter body will be drafted here.]';
  const rawParas = bodyText.split(/\n\s*\n|\n/);

  for (const p of rawParas) {
    const trimmed = p.trim();
    if (!trimmed) continue;

    // Check if paragraph starts with a number (e.g. "1.", "2.")
    const isNumbered = /^\d+\.\s*/.test(trimmed);

    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        indent: isNumbered
          ? { left: convertMillimetersToTwip(8) }
          : { left: convertMillimetersToTwip(10), firstLine: convertMillimetersToTwip(4) },
        spacing: { after: 160, line: 280 },
        children: [
          new TextRun({
            text: trimmed,
            font: fontName,
            size: defaultFontSizeHalfPoints,
          }),
        ],
      })
    );
  }

  // 7. Closing & Signatory Block
  if (doc.closing?.trim()) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { before: 240, after: 80 },
        children: [
          new TextRun({
            text: doc.closing.trim(),
            font: fontName,
            size: defaultFontSizeHalfPoints,
          }),
        ],
      })
    );
  }

  // Embed Scanned Signature Image if present
  if (signature?.dataUrl && signature.dataUrl.startsWith('data:image/')) {
    try {
      const base64Data = signature.dataUrl.split(',')[1];
      const binary = atob(base64Data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { before: 180, after: 60 },
          children: [
            new ImageRun({
              data: bytes,
              transformation: {
                width: 140,
                height: 50,
              },
            } as any),
          ],
        })
      );
    } catch (e) {
      console.warn('Could not embed signature in Word document:', e);
    }
  }

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

  // Signatory Name Block
  if (doc.signatoryName?.trim()) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { before: signature?.dataUrl ? 40 : 360, after: 40 },
        children: [
          new TextRun({
            text: `(${doc.signatoryName.trim()})`,
            bold: true,
            font: fontName,
            size: defaultFontSizeHalfPoints,
          }),
        ],
      })
    );
  }

  for (const desig of designationLines) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 30 },
        children: [
          new TextRun({
            text: desig,
            font: fontName,
            size: defaultFontSizeHalfPoints,
          }),
        ],
      })
    );
  }

  if (doc.signatoryOffice?.trim() && !designationLines.includes(doc.signatoryOffice.trim())) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: doc.signatoryOffice.trim(),
            font: fontName,
            size: defaultFontSizeHalfPoints,
          }),
        ],
      })
    );
  }

  // 8. Enclosures (if any exist)
  if (doc.enclosures && doc.enclosures.length > 0 && doc.enclosures.some((e) => e.trim())) {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 200, after: 60 },
        children: [
          new TextRun({
            text: 'Enclosure(s): As stated above.',
            bold: true,
            underline: { type: UnderlineType.SINGLE },
            font: fontName,
            size: defaultFontSizeHalfPoints - 2,
          }),
        ],
      })
    );

    doc.enclosures.forEach((enc, idx) => {
      if (enc.trim()) {
        paragraphs.push(
          new Paragraph({
            indent: { left: convertMillimetersToTwip(6) },
            spacing: { after: 30 },
            children: [
              new TextRun({
                text: `${idx + 1}. ${enc.trim()}`,
                font: fontName,
                size: defaultFontSizeHalfPoints - 2,
              }),
            ],
          })
        );
      }
    });
  }

  // 9. Copy To / Endorsement (if any exist)
  if (doc.copyTo && doc.copyTo.length > 0 && doc.copyTo.some((c) => c.trim())) {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 240, after: 60 },
        children: [
          new TextRun({
            text: doc.memoNo
              ? `Memo No. ${doc.memoNo}/1(${doc.copyTo.length})`
              : 'Memo No. [Memo No.]/1(...)',
            bold: true,
            font: fontName,
            size: defaultFontSizeHalfPoints - 2,
          }),
          new TextRun({
            text: `\t\t\t\t\t\tDated: ${doc.date || '[Date]'}`,
            bold: true,
            font: fontName,
            size: defaultFontSizeHalfPoints - 2,
          }),
        ],
      })
    );

    paragraphs.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: 'Copy forwarded for information and necessary action to:',
            italics: true,
            font: fontName,
            size: defaultFontSizeHalfPoints - 2,
          }),
        ],
      })
    );

    doc.copyTo.forEach((recipient, idx) => {
      if (recipient.trim()) {
        paragraphs.push(
          new Paragraph({
            indent: { left: convertMillimetersToTwip(6) },
            spacing: { after: 30 },
            children: [
              new TextRun({
                text: `${idx + 1}. ${recipient.trim()}`,
                font: fontName,
                size: defaultFontSizeHalfPoints - 2,
              }),
            ],
          })
        );
      }
    });

    // Endorsement signature
    const endoText = designationLines.length > 0 ? designationLines[0] : (doc.signatoryDesignation?.trim() || '');
    if (endoText) {
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { before: 300, after: 40 },
          children: [
            new TextRun({
              text: endoText,
              bold: true,
              font: fontName,
              size: defaultFontSizeHalfPoints - 2,
            }),
          ],
        })
      );
    }
  }

  // Create Document with A4 section configuration
  const docxDocument = new Document({
    creator: 'Official Letter Assistant',
    title: doc.title || 'Official Letter',
    description: doc.subject || 'Government Official Letter',
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: topMarginTwips,
              bottom: bottomMarginTwips,
              left: leftMarginTwips,
              right: rightMarginTwips,
            },
          },
        },
        children: paragraphs,
      },
    ],
  });

  return await Packer.toBlob(docxDocument);
}
