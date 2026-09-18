import React from 'react';
import { X, Trash2, Upload, FileText, PenTool } from 'lucide-react';
import { LetterheadAsset, SignatureAsset } from '../types';

interface ActiveAssetViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'letterhead' | 'signature';
  letterhead?: LetterheadAsset | null;
  signature?: SignatureAsset | null;
  onUploadNew: () => void;
  onRemove: () => void;
}

export const ActiveAssetViewerModal: React.FC<ActiveAssetViewerModalProps> = ({
  isOpen,
  onClose,
  type,
  letterhead,
  signature,
  onUploadNew,
  onRemove,
}) => {
  if (!isOpen) return null;

  const isLetterhead = type === 'letterhead';
  const hasAsset = isLetterhead ? !!letterhead : !!signature;
  const assetName = isLetterhead ? letterhead?.name : signature?.name;
  const imageUrl = isLetterhead
    ? letterhead?.previewImageUrl || letterhead?.dataUrl
    : signature?.dataUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isLetterhead ? (
              <FileText className="w-4 h-4 text-emerald-400" />
            ) : (
              <PenTool className="w-4 h-4 text-blue-400" />
            )}
            <h2 className="font-semibold text-sm">
              {isLetterhead ? 'Active Letterhead' : 'Active Signature'}
            </h2>
            {isLetterhead && letterhead && (
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-medium bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
                {letterhead.type === 'word' ? 'Word Document' : letterhead.type === 'pdf' ? 'PDF Letterhead' : 'Image'}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {hasAsset && imageUrl ? (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-center min-h-[160px] max-h-[300px] overflow-hidden">
                <img
                  src={imageUrl}
                  alt={isLetterhead ? 'Letterhead Preview' : 'Signature Preview'}
                  className="max-w-full max-h-[260px] object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {assetName && (
                <p className="text-xs text-slate-600 font-medium text-center truncate">
                  {assetName}
                </p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    onRemove();
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove {isLetterhead ? 'Letterhead' : 'Signature'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onUploadNew();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded font-medium transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Replace</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-1.5 text-xs text-white bg-slate-900 hover:bg-slate-800 rounded font-medium transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <p className="text-sm text-slate-600 font-medium">
                {isLetterhead
                  ? 'No letterhead is currently active.'
                  : 'No signature is currently uploaded.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onUploadNew();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload {isLetterhead ? 'Letterhead' : 'Signature'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
