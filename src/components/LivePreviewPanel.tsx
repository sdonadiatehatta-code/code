import React, { useState, useMemo } from 'react';
import {
  LetterDocument,
  LetterheadAsset,
  SignatureAsset,
} from '../types';
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { AshokaStambh } from './AshokaStambh';

interface LivePreviewPanelProps {
  document: LetterDocument;
  letterhead?: LetterheadAsset | null;
  signature?: SignatureAsset | null;
}

export const LivePreviewPanel: React.FC<LivePreviewPanelProps> = ({
  document,
  letterhead,
  signature,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(80); // 80% default magnification

  // Estimate multi-page pagination based on body length and elements
  const { pages } = useMemo(() => {
    const bodyParagraphs = document.body.split('\n\n').filter(Boolean);
    const estLinesPerPara = bodyParagraphs.map((p) => Math.ceil(p.length / 85));
    const totalLines = estLinesPerPara.reduce((a, b) => a + b, 0);

    // Approximate lines that fit on page 1 (accounting for letterhead, header, To, Sub, Ref)
    const page1Capacity = letterhead ? 22 : 28;

    if (totalLines <= page1Capacity) {
      return {
        pages: [
          {
            pageNumber: 1,
            paragraphs: bodyParagraphs,
            isFirstPage: true,
            isLastPage: true,
          },
        ],
        totalPages: 1,
      };
    } else {
      // Split paragraphs across pages
      const page1Paras: string[] = [];
      const page2Paras: string[] = [];
      let accLines = 0;

      for (let i = 0; i < bodyParagraphs.length; i++) {
        const lines = estLinesPerPara[i];
        if (accLines + lines <= page1Capacity || page1Paras.length === 0) {
          page1Paras.push(bodyParagraphs[i]);
          accLines += lines;
        } else {
          page2Paras.push(bodyParagraphs[i]);
        }
      }

      return {
        pages: [
          {
            pageNumber: 1,
            paragraphs: page1Paras,
            isFirstPage: true,
            isLastPage: false,
          },
          {
            pageNumber: 2,
            paragraphs: page2Paras,
            isFirstPage: false,
            isLastPage: true,
          },
        ],
        totalPages: 2,
      };
    }
  }, [document.body, letterhead]);

  // Adjust zoom
  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.max(65, Math.min(140, prev + delta)));
  };

  // Font family class mapping
  const fontFamilyClass =
    document.formatting.fontFamily === 'arial'
      ? 'font-sans'
      : document.formatting.fontFamily === 'georgia'
      ? 'font-serif'
      : 'font-serif'; // Times New Roman / Lora

  return (
    <section className="w-full lg:w-[65%] flex-1 flex flex-col bg-slate-200/90 overflow-hidden relative">
      {/* Top Toolbar for Live Preview */}
      <div className="bg-white border-b border-slate-300 px-4 py-2 flex items-center justify-between gap-3 shrink-0 shadow-xs z-20">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Live Preview
          </span>
        </div>

        {/* Zoom Controls with 80% default reset */}
        <div className="flex items-center bg-slate-100 rounded border border-slate-300">
          <button
            id="btn-zoom-out"
            onClick={() => handleZoom(-10)}
            className="p-1.5 text-slate-600 hover:text-slate-900 transition cursor-pointer"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-zoom-reset"
            onClick={() => setZoomLevel(80)}
            className="px-2 py-0.5 text-[11px] font-mono font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition min-w-[44px] text-center border-x border-slate-200 cursor-pointer"
            title="Reset zoom to 80%"
          >
            {zoomLevel}%
          </button>
          <button
            id="btn-zoom-in"
            onClick={() => handleZoom(10)}
            className="p-1.5 text-slate-600 hover:text-slate-900 transition cursor-pointer"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Scrollable Canvas for Document Sheets — Maximum Practical Space */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center gap-8 custom-scrollbar">
        {pages.map((pageInfo) => (
          <div
            key={pageInfo.pageNumber}
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              width: '210mm',
              minHeight: '297mm',
              paddingTop: `${pageInfo.isFirstPage && document.letterheadConfig ? 6 : (document.formatting.margins?.top ?? 25)}mm`,
              paddingBottom: `${document.formatting.margins?.bottom ?? 25}mm`,
              paddingLeft: `${document.formatting.margins?.left ?? 25}mm`,
              paddingRight: `${document.formatting.margins?.right ?? 20}mm`,
            }}
            className={`bg-white shadow-xl rounded-sm border border-slate-300 text-slate-900 leading-normal flex flex-col justify-between select-text transition-all duration-150 ${fontFamilyClass}`}
          >
            {/* Top / Header Portion */}
            <div>
              {/* PAGE 1: Uploaded Official Letterhead */}
              {pageInfo.isFirstPage ? (
                <div className="relative">
                  {/* Configured Text-Based Official Letterhead */}
                  {document.letterheadConfig ? (
                    <div className="text-center mb-2.5 pt-0">
                      {/* 1. Uploaded Emblem (if not uploaded, keep space empty) */}
                      {document.letterheadConfig.emblemDataUrl ? (
                        <div className="flex justify-center mb-1.5">
                          <img
                            src={document.letterheadConfig.emblemDataUrl}
                            alt="Emblem"
                            className="max-h-12 max-w-[120px] object-contain"
                          />
                        </div>
                      ) : null}

                      {/* 2. Letter Head Text Lines (Excluding empty lines) */}
                      {[
                        document.letterheadConfig.line1,
                        document.letterheadConfig.line2,
                        document.letterheadConfig.line3,
                        document.letterheadConfig.line4,
                      ]
                        .map((l) => (l ? l.trim() : ''))
                        .filter(Boolean)
                        .map((line, idx) => (
                          <p
                            key={idx}
                            className={`text-slate-950 leading-tight ${
                              idx === 0
                                ? 'text-sm font-extrabold uppercase tracking-wide'
                                : idx === 1
                                ? 'text-xs font-bold uppercase tracking-normal'
                                : 'text-[11px] font-semibold text-slate-800'
                            }`}
                          >
                            {line}
                          </p>
                        ))}

                      {/* 3. Office Email ID and Telephone */}
                      {(() => {
                        const email = document.letterheadConfig.email?.trim();
                        const phone = document.letterheadConfig.telephone?.trim();
                        if (!email && !phone) return null;

                        if (email && phone) {
                          return (
                            <div className="flex items-center justify-between text-[10px] text-slate-700 mt-1 font-sans px-0.5">
                              <span>
                                Email: <span className="font-medium text-slate-900">{email}</span>
                              </span>
                              <span>
                                Tel: <span className="font-medium text-slate-900">{phone}</span>
                              </span>
                            </div>
                          );
                        }

                        return (
                          <div className="text-center text-[10px] text-slate-700 mt-1 font-sans">
                            {email ? (
                              <span>
                                Email: <span className="font-medium text-slate-900">{email}</span>
                              </span>
                            ) : (
                              <span>
                                Tel: <span className="font-medium text-slate-900">{phone}</span>
                              </span>
                            )}
                          </div>
                        );
                      })()}

                      {/* 4. Black Bold Line divider before letter body starts */}
                      <div className="w-full border-b-[2.5px] border-black my-3" />
                    </div>
                  ) : letterhead ? (
                    <div className="mb-4">
                      {/* Fallback to legacy uploaded letterhead if letterheadConfig is absent */}
                      {letterhead.previewImageUrl || letterhead.dataUrl ? (
                        <div className="w-full flex items-center justify-center overflow-hidden mb-2">
                          <img
                            src={letterhead.previewImageUrl || letterhead.dataUrl}
                            alt="Official Letterhead"
                            className="w-full object-contain max-h-[140px]"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : null}
                      <div className="w-full border-b-[2.5px] border-black my-2.5" />
                    </div>
                  ) : null}

                  {/* Body of the letter starts with Memo No. and Date row */}
                  <div className="flex items-center justify-between text-xs font-semibold mb-4 text-slate-900">
                    <div>
                      <span>Memo No. </span>
                      <span className="font-bold underline decoration-slate-400 font-mono">
                        {document.memoNo || '[Memo No.]'}
                      </span>
                    </div>
                    <div>
                      <span className="font-mono">
                        {document.date
                          ? document.date.toLowerCase().startsWith('dated')
                            ? document.date
                            : `Dated: ${document.date}`
                          : 'Dated: [Date]'}
                      </span>
                    </div>
                  </div>

                  {/* Recipient ("To") Address Block */}
                  <div className="mb-4 text-xs leading-relaxed">
                    <p className="font-semibold text-slate-800">{document.toPrefix || 'To'}</p>
                    <div className="pl-4 space-y-0.5 mt-0.5">
                      {document.toName && <p className="font-bold">{document.toName}</p>}
                      {document.toDesignation ? (
                        <p className="font-semibold">{document.toDesignation}</p>
                      ) : (
                        <p className="text-slate-400 italic font-mono">[Recipient Designation]</p>
                      )}
                      {document.toOffice && <p>{document.toOffice}</p>}
                      {document.toAddress ? (
                        <p className="whitespace-pre-line text-slate-700">{document.toAddress}</p>
                      ) : (
                        <p className="text-slate-400 italic font-mono">[Recipient Office / Address]</p>
                      )}
                    </div>
                  </div>

                  {/* Subject Line (Bold and Underlined) */}
                  <div className="mb-3 pl-4 text-xs">
                    <span className="font-bold text-slate-900">Sub: </span>
                    <span className="font-bold underline underline-offset-2 decoration-slate-900 text-slate-950">
                      {document.subject || '[Subject of the official communication]'}
                    </span>
                  </div>

                  {/* Reference Line */}
                  {document.reference && (
                    <div className="mb-3 pl-4 text-xs">
                      <span className="font-bold text-slate-900">Ref: </span>
                      <span className="italic text-slate-800">{document.reference}</span>
                    </div>
                  )}

                  {/* Salutation */}
                  <div className="mb-3 text-xs font-medium text-slate-800">
                    {document.salutation || 'Sir,'}
                  </div>
                </div>
              ) : (
                /* Continuation Page Header */
                <div className="border-b border-slate-300 pb-2 mb-4 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>
                    Memo No. {document.memoNo || '...'} | Page {pageInfo.pageNumber}
                  </span>
                  <span>{document.date ? `Dated: ${document.date}` : ''}</span>
                </div>
              )}

              {/* Main Body Paragraphs */}
              <div className="text-xs space-y-3 leading-relaxed text-justify">
                {pageInfo.paragraphs.length > 0 ? (
                  pageInfo.paragraphs.map((para, idx) => {
                    const isNumbered = /^\d+\.\s*/.test(para.trim());
                    return (
                      <p
                        key={idx}
                        className={`${
                          isNumbered ? 'pl-2' : 'indent-8'
                        } whitespace-pre-wrap text-slate-800`}
                      >
                        {para}
                      </p>
                    );
                  })
                ) : (
                  <p className="text-slate-400 italic text-center py-8 font-mono">
                    [Instruct the AI assistant to draft or generate the letter body]
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Portion: Signatory & Endorsements on Last Page */}
            {pageInfo.isLastPage && (() => {
              const designationLines = [
                document.signatoryDesignationLine1,
                document.signatoryDesignationLine2,
                document.signatoryDesignationLine3,
                document.signatoryDesignationLine4,
              ].some((l) => l !== undefined)
                ? [
                    document.signatoryDesignationLine1,
                    document.signatoryDesignationLine2,
                    document.signatoryDesignationLine3,
                    document.signatoryDesignationLine4,
                  ]
                    .map((l) => l?.trim())
                    .filter((l): l is string => Boolean(l))
                : (document.signatoryDesignation?.trim() ? [document.signatoryDesignation.trim()] : []);

              return (
                <div className="mt-8 pt-4">
                  {/* Closing & Signatory Block (Right-aligned) */}
                  <div className="flex flex-col items-end text-xs ml-auto max-w-[280px] text-right">
                    {document.closing?.trim() ? (
                      <p className="mb-1 text-slate-800 font-medium">{document.closing.trim()}</p>
                    ) : null}

                    {/* Uploaded Scanned Signature Image */}
                    <div className="h-16 flex items-center justify-end my-1 w-full relative">
                      {signature?.dataUrl ? (
                        <img
                          src={signature.dataUrl}
                          alt="Official Signature"
                          className="max-h-14 max-w-[160px] object-contain"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="border border-dashed border-slate-300 rounded px-3 py-1 text-[10px] text-slate-400 font-mono">
                          [Signature]
                        </div>
                      )}
                    </div>

                    {/* Signatory Details */}
                    <div className="space-y-0.5">
                      {document.signatoryName?.trim() && (
                        <p className="font-bold text-slate-900">
                          ({document.signatoryName.trim()})
                        </p>
                      )}
                      {designationLines.map((line, idx) => (
                        <p key={idx} className="text-slate-800">
                          {line}
                        </p>
                      ))}
                      {document.signatoryOffice?.trim() &&
                        !designationLines.includes(document.signatoryOffice.trim()) && (
                          <p className="text-slate-700">{document.signatoryOffice.trim()}</p>
                        )}
                    </div>
                  </div>

                  {/* Enclosures Section (if present) */}
                  {document.enclosures && document.enclosures.length > 0 && (
                    <div className="mt-6 pt-2 border-t border-slate-200 text-xs">
                      <p className="font-bold underline text-slate-800 mb-1">
                        Enclosure(s): As stated above.
                      </p>
                      <ol className="list-decimal list-inside pl-2 space-y-0.5 text-slate-700">
                        {document.enclosures.map((enc, idx) => (
                          <li key={idx}>{enc}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Copy To / Endorsement Section (if present) */}
                  {document.copyTo && document.copyTo.length > 0 && (
                    <div className="mt-6 pt-3 border-t border-slate-300 text-xs">
                      <div className="flex items-center justify-between font-semibold mb-2">
                        <span>
                          Memo No. {document.memoNo || '[Memo No.]'}/1({document.copyTo.length})
                        </span>
                        <span>
                          {document.date
                            ? document.date.toLowerCase().startsWith('dated')
                              ? document.date
                              : `Dated: ${document.date}`
                            : 'Dated: [Date]'}
                        </span>
                      </div>

                      <p className="italic text-slate-700 mb-1">
                        Copy forwarded for information and necessary action to:
                      </p>
                      <ol className="list-decimal list-inside pl-2 space-y-0.5 text-slate-800 mb-4">
                        {document.copyTo.map((recipient, idx) => (
                          <li key={idx}>{recipient}</li>
                        ))}
                      </ol>

                      <div className="flex flex-col items-end text-right">
                        {designationLines.length > 0 && (
                          <p className="font-bold text-slate-900">
                            {designationLines[0]}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Page Number indicator at bottom of sheet */}
                  <div className="mt-6 text-center text-[10px] text-slate-400 font-mono">
                    — Page {pageInfo.pageNumber} —
                  </div>
                </div>
              );
            })()}
          </div>
        ))}
      </div>
    </section>
  );
};
