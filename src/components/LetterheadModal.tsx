import React, { useState, useRef } from 'react';
import {
  LetterheadAsset,
  LetterDocument,
} from '../types';
import {
  Upload,
  Trash2,
  Check,
  FileText,
  Sliders,
  X,
  Star,
} from 'lucide-react';
import { processUniversalLetterheadFile } from '../utils/letterheadRenderer';

interface LetterheadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLetterhead?: LetterheadAsset | null;
  savedLetterheads: LetterheadAsset[];
  onSelectLetterhead: (lh: LetterheadAsset | null) => void;
  onSaveAsDefault: (lh: LetterheadAsset) => void;
  onDeleteLetterhead: (id: string) => void;
  onAddLetterhead: (lh: LetterheadAsset) => void;
  document: LetterDocument;
  onUpdateOffset: (mm: number) => void;
}

export const LetterheadModal: React.FC<LetterheadModalProps> = ({
  isOpen,
  onClose,
  currentLetterhead,
  savedLetterheads,
  onSelectLetterhead,
  onSaveAsDefault,
  onDeleteLetterhead,
  onAddLetterhead,
  document,
  onUpdateOffset,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadError(null);

    try {
      const processed = await processUniversalLetterheadFile(file);
      const newLh: LetterheadAsset = {
        id: `lh-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        type: processed.type,
        dataUrl: processed.dataUrl,
        pdfBytesBase64: processed.pdfBytesBase64,
        wordBytesBase64: processed.wordBytesBase64,
        previewImageUrl: processed.previewImageUrl,
        createdAt: new Date().toISOString(),
      };
      onAddLetterhead(newLh);
      onSelectLetterhead(newLh);
    } catch (err: any) {
      console.error('Error processing letterhead upload:', err);
      setUploadError(err.message || 'Failed to process letterhead file.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-sm tracking-wide uppercase">
              Official Letterhead Management
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-700 custom-scrollbar">
          {/* Upload Box */}
          <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-lg p-5 text-center bg-slate-50 transition">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".docx,.doc,.pdf,.png,.jpg,.jpeg,.DOCX,.DOC,.PDF,.PNG,.JPG,.JPEG"
              className="hidden"
            />
            <Upload className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="font-bold text-slate-800 text-sm">
              Upload Official Letterhead Document
            </p>
            <p className="text-slate-500 text-[11px] mt-1 max-w-md mx-auto">
              Select any official <span className="font-semibold text-emerald-800">Word document (.docx, .doc)</span> or <span className="font-semibold text-emerald-800">PDF letterhead (.pdf)</span>, or high-res scan image.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="mt-3 px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-medium transition shadow-xs disabled:opacity-50"
            >
              {isProcessing ? 'Processing Letterhead...' : 'Select Word (.docx) or PDF (.pdf) File'}
            </button>
          </div>

          {uploadError && (
            <p className="text-rose-600 text-xs font-medium bg-rose-50 p-2.5 rounded border border-rose-200">
              {uploadError}
            </p>
          )}

          {/* Current Active Letterhead */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Currently Applied Letterhead
              </span>
              {currentLetterhead && (
                <button
                  onClick={() => onSelectLetterhead(null)}
                  className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Remove from Letter
                </button>
              )}
            </div>

            {currentLetterhead ? (
              <div className="space-y-3">
                <div className="bg-white p-2.5 rounded border border-slate-300 flex items-center gap-3">
                  <div className="w-24 h-14 bg-slate-100 border border-slate-200 rounded overflow-hidden flex items-center justify-center shrink-0">
                    <img
                      src={currentLetterhead.previewImageUrl || currentLetterhead.dataUrl}
                      alt={currentLetterhead.name}
                      className="max-h-full max-w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">
                      {currentLetterhead.name}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase">
                      Format: {currentLetterhead.type.toUpperCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => onSaveAsDefault(currentLetterhead)}
                    className="px-2.5 py-1 text-[11px] rounded bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-300 flex items-center gap-1"
                  >
                    <Star className="w-3 h-3 text-amber-500" />
                    <span>Set as Default</span>
                  </button>
                </div>

                {/* Spacing Offset Slider */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-700">
                      Letterhead Top Clearance Offset:
                    </span>
                    <span className="font-bold text-emerald-800 font-mono">
                      {document.formatting.letterheadTopOffsetMm} mm
                    </span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={80}
                    step={2}
                    value={document.formatting.letterheadTopOffsetMm}
                    onChange={(e) => onUpdateOffset(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Adjust this slider so your letter text starts cleanly underneath the official header banner.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-xs italic">
                No letterhead attached. Using standard typographic government header with State Emblem.
              </p>
            )}
          </div>

          {/* Saved Letterheads Library */}
          <div>
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2.5">
              Available & Saved Letterheads ({savedLetterheads.length})
            </h3>
            {savedLetterheads.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center text-slate-500">
                <p className="font-medium text-xs text-slate-700 mb-1">
                  No letterheads uploaded yet
                </p>
                <p className="text-[11px] max-w-sm mx-auto">
                  Click the upload box above to select any official Word document (.docx/.doc) or PDF letterhead (.pdf) from your computer.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedLetterheads.map((lh) => {
                  const isSelected = currentLetterhead?.id === lh.id;
                  return (
                    <div
                      key={lh.id}
                      className={`p-3 rounded-lg border text-left transition flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <p className="font-semibold text-slate-900 text-xs truncate">
                          {lh.name}
                        </p>
                        <div className="flex items-center gap-1 shrink-0">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              lh.type === 'word'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : lh.type === 'pdf'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {lh.type === 'word' ? 'Word .docx' : lh.type === 'pdf' ? 'PDF' : 'Image'}
                          </span>
                          {lh.isDefault && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                              Default
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="h-16 bg-slate-50 border border-slate-200 rounded flex items-center justify-center p-1 mb-2 overflow-hidden">
                        <img
                          src={lh.previewImageUrl || lh.dataUrl}
                          alt={lh.name}
                          className="max-h-full max-w-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <button
                          onClick={() => onSelectLetterhead(lh)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded transition flex items-center gap-1 ${
                            isSelected
                              ? 'bg-emerald-700 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          }`}
                        >
                          {isSelected ? <Check className="w-3 h-3" /> : null}
                          <span>{isSelected ? 'Applied' : 'Use Letterhead'}</span>
                        </button>

                        <button
                          onClick={() => onDeleteLetterhead(lh.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition"
                          title="Delete letterhead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-medium transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
