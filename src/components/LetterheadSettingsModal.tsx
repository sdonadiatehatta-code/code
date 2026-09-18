import React, { useState, useEffect, useRef } from 'react';
import { X, Check, RotateCcw, Upload, Trash2 } from 'lucide-react';
import { TextLetterheadConfig } from '../types';

interface LetterheadSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: TextLetterheadConfig;
  onSave: (newConfig: TextLetterheadConfig) => void;
}

export const LetterheadSettingsModal: React.FC<LetterheadSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [formData, setFormData] = useState<TextLetterheadConfig>({
    emblemDataUrl: config.emblemDataUrl ?? '',
    line1: config.line1 ?? '',
    line2: config.line2 ?? '',
    line3: config.line3 ?? '',
    line4: config.line4 ?? '',
    email: config.email ?? '',
    telephone: config.telephone ?? '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        emblemDataUrl: config.emblemDataUrl ?? '',
        line1: config.line1 ?? '',
        line2: config.line2 ?? '',
        line3: config.line3 ?? '',
        line4: config.line4 ?? '',
        email: config.email ?? '',
        telephone: config.telephone ?? '',
      });
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  // Filter non-empty lines for preview
  const activeLines = [formData.line1, formData.line2, formData.line3, formData.line4]
    .map((l) => (l ? l.trim() : ''))
    .filter(Boolean);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleReset = () => {
    setFormData({
      emblemDataUrl: '',
      line1: 'GOVERNMENT OF WEST BENGAL',
      line2: 'OFFICE OF THE SUB-DIVISIONAL OFFICER',
      line3: 'TEHATTA, NADIA',
      line4: '',
      email: 'sdonadiatehatta@gmail.com',
      telephone: '',
    });
  };

  const handleEmblemUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormData((prev) => ({ ...prev, emblemDataUrl: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveEmblem = () => {
    setFormData((prev) => ({ ...prev, emblemDataUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-slate-300 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <h2 className="font-bold text-base leading-tight">Letterhead</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-800">
          {/* Official Emblem Upload */}
          <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
                Official Emblem
              </h3>
              {formData.emblemDataUrl && (
                <button
                  type="button"
                  onClick={handleRemoveEmblem}
                  className="text-red-600 hover:text-red-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove Emblem
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 pt-1">
              {formData.emblemDataUrl ? (
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-300 rounded flex items-center justify-center p-1 overflow-hidden">
                    <img
                      src={formData.emblemDataUrl}
                      alt="Uploaded Emblem"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Emblem Uploaded</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-1 px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded font-medium text-slate-700 transition cursor-pointer"
                    >
                      Change Emblem
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg font-semibold text-slate-700 flex items-center gap-2 transition cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>Upload Emblem</span>
                </button>
              )}

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleEmblemUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Letter Head Text Lines (1 to 4) */}
          <div className="space-y-3 bg-white p-4 border border-slate-200 rounded-lg shadow-2xs">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h3 className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
                Letter Head Text Lines
              </h3>
            </div>

            {/* Line 1 */}
            <div>
              <label
                htmlFor="input-lh-line-1"
                className="block font-semibold text-slate-700 mb-1"
              >
                Letter head text first line
              </label>
              <input
                id="input-lh-line-1"
                type="text"
                value={formData.line1}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, line1: e.target.value }))
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            {/* Line 2 */}
            <div>
              <label
                htmlFor="input-lh-line-2"
                className="block font-semibold text-slate-700 mb-1"
              >
                Letter head text second line
              </label>
              <input
                id="input-lh-line-2"
                type="text"
                value={formData.line2}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, line2: e.target.value }))
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            {/* Line 3 */}
            <div>
              <label
                htmlFor="input-lh-line-3"
                className="block font-semibold text-slate-700 mb-1"
              >
                Letter head text third line
              </label>
              <input
                id="input-lh-line-3"
                type="text"
                value={formData.line3}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, line3: e.target.value }))
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            {/* Line 4 */}
            <div>
              <label
                htmlFor="input-lh-line-4"
                className="block font-semibold text-slate-700 mb-1"
              >
                Letter head text fourth line
              </label>
              <input
                id="input-lh-line-4"
                type="text"
                value={formData.line4}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, line4: e.target.value }))
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Contact Details (Email & Telephone) */}
          <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h3 className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
                Office Contact Line
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="input-lh-email"
                  className="block font-semibold text-slate-700 mb-1"
                >
                  Email ID of the office
                </label>
                <input
                  id="input-lh-email"
                  type="text"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono text-[11px] focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label
                  htmlFor="input-lh-telephone"
                  className="block font-semibold text-slate-700 mb-1"
                >
                  Telephone of the office
                </label>
                <input
                  id="input-lh-telephone"
                  type="text"
                  value={formData.telephone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, telephone: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono text-[11px] focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Real-time Letterhead Preview Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Letterhead Live Preview
            </p>
            <div className="bg-white border border-slate-300 rounded pt-2 pb-3 px-4 text-center shadow-inner font-serif">
              {/* 1. Uploaded Emblem (if not uploaded, keep space empty) */}
              {formData.emblemDataUrl ? (
                <div className="flex justify-center mb-1.5">
                  <img
                    src={formData.emblemDataUrl}
                    alt="Emblem"
                    className="max-h-12 max-w-[120px] object-contain"
                  />
                </div>
              ) : null}

              {/* 2. Text lines */}
              {activeLines.map((line, idx) => (
                <p
                  key={idx}
                  className={`leading-tight text-slate-950 ${
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

              {/* 3. Contact line: email on left, phone on right; or centered if only one */}
              {(() => {
                const email = formData.email?.trim();
                const phone = formData.telephone?.trim();
                if (!email && !phone) return null;

                if (email && phone) {
                  return (
                    <div className="flex items-center justify-between text-[10px] text-slate-700 mt-1 font-sans px-1">
                      <span>Email: {email}</span>
                      <span>Tel: {phone}</span>
                    </div>
                  );
                }

                return (
                  <div className="text-center text-[10px] text-slate-700 mt-1 font-sans">
                    {email ? <span>Email: {email}</span> : <span>Tel: {phone}</span>}
                  </div>
                );
              })()}

              {/* 4. The Black Bold Line */}
              <div className="w-full border-b-[2.5px] border-black my-2.5" />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleReset}
            type="button"
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 font-medium transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              type="button"
              className="px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-200 rounded font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              type="button"
              className="px-4 py-1.5 text-xs bg-emerald-700 hover:bg-emerald-600 text-white rounded font-semibold flex items-center gap-1.5 transition shadow-xs"
            >
              <Check className="w-4 h-4" />
              Save & Apply Letterhead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
