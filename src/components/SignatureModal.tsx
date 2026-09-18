import React, { useState, useEffect, useRef } from 'react';
import { X, Check, RotateCcw, Upload, Trash2 } from 'lucide-react';
import { SignatureAsset } from '../types';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSignature?: SignatureAsset | null;
  closing?: string;
  officerName?: string;
  designationLine1?: string;
  designationLine2?: string;
  designationLine3?: string;
  designationLine4?: string;
  onSave: (data: {
    signatureDataUrl: string | null;
    closing: string;
    officerName: string;
    designationLine1: string;
    designationLine2: string;
    designationLine3: string;
    designationLine4: string;
  }) => void;
}

const CLOSING_OPTIONS = [
  { id: 'opt-faithfully', label: 'Yours Faithfully', value: 'Yours faithfully,' },
  { id: 'opt-truly', label: 'Yours Truly', value: 'Yours truly,' },
  { id: 'opt-sincerely', label: 'Yours Sincerely', value: 'Yours sincerely,' },
  { id: 'opt-blank', label: 'Blank', value: '' },
];

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  currentSignature,
  closing = 'Yours faithfully,',
  officerName = '',
  designationLine1 = '',
  designationLine2 = '',
  designationLine3 = '',
  designationLine4 = '',
  onSave,
}) => {
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(
    currentSignature?.dataUrl ?? null
  );
  const [selectedClosing, setSelectedClosing] = useState<string>(closing);
  const [nameInput, setNameInput] = useState<string>(officerName);
  const [line1, setLine1] = useState<string>(designationLine1);
  const [line2, setLine2] = useState<string>(designationLine2);
  const [line3, setLine3] = useState<string>(designationLine3);
  const [line4, setLine4] = useState<string>(designationLine4);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSignatureDataUrl(currentSignature?.dataUrl ?? null);
      setSelectedClosing(closing ?? 'Yours faithfully,');
      setNameInput(officerName || '');
      setLine1(designationLine1 || '');
      setLine2(designationLine2 || '');
      setLine3(designationLine3 || '');
      setLine4(designationLine4 || '');
    }
  }, [
    isOpen,
    currentSignature,
    closing,
    officerName,
    designationLine1,
    designationLine2,
    designationLine3,
    designationLine4,
  ]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setSignatureDataUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSignature = () => {
    setSignatureDataUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    setSignatureDataUrl(null);
    setSelectedClosing('Yours faithfully,');
    setNameInput('');
    setLine1('');
    setLine2('');
    setLine3('');
    setLine4('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectClosing = (optionValue: string) => {
    // If user clicks the currently selected option, toggle to blank if it wasn't blank
    if (selectedClosing.trim() === optionValue.trim()) {
      if (optionValue !== '') {
        setSelectedClosing('');
      }
    } else {
      setSelectedClosing(optionValue);
    }
  };

  const isOptionSelected = (optValue: string) => {
    if (optValue === '') {
      return selectedClosing.trim() === '';
    }
    return selectedClosing.trim().toLowerCase().startsWith(optValue.trim().toLowerCase().replace(',', ''));
  };

  const handleSave = () => {
    onSave({
      signatureDataUrl,
      closing: selectedClosing,
      officerName: nameInput.trim(),
      designationLine1: line1.trim(),
      designationLine2: line2.trim(),
      designationLine3: line3.trim(),
      designationLine4: line4.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-slate-300 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header - No icon */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <h2 className="font-bold text-base leading-tight">Signature</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-800">
          {/* 1. Upload Official Signature */}
          <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
                Official Signature
              </h3>
              {signatureDataUrl && (
                <button
                  type="button"
                  onClick={handleRemoveSignature}
                  className="text-red-600 hover:text-red-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove Signature
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 pt-1">
              {signatureDataUrl ? (
                <div className="flex items-center gap-3">
                  <div className="w-28 h-16 bg-slate-50 border border-slate-300 rounded flex items-center justify-center p-1.5 overflow-hidden">
                    <img
                      src={signatureDataUrl}
                      alt="Uploaded Signature"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Signature Uploaded</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-1 px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded font-medium text-slate-700 transition cursor-pointer"
                    >
                      Change Signature
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
                  <span>Upload Signature</span>
                </button>
              )}

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* 2. Closing / Valediction Checkboxes */}
          <div className="space-y-2 bg-white p-4 border border-slate-200 rounded-lg shadow-2xs">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h3 className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
                Closing
              </h3>
              <span className="text-[11px] text-slate-400 font-normal">Select one option</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {CLOSING_OPTIONS.map((opt) => {
                const checked = isOptionSelected(opt.value);
                return (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border cursor-pointer transition select-none ${
                      checked
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="closing_option"
                      checked={checked}
                      onChange={() => handleSelectClosing(opt.value)}
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                    />
                    <span className="text-xs">{opt.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 3. Officer Name & Designation (4 Optional Lines) */}
          <div className="space-y-3 bg-white p-4 border border-slate-200 rounded-lg shadow-2xs">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h3 className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
                Signatory Details
              </h3>
            </div>

            {/* Name of the officer (Optional) */}
            <div>
              <label
                htmlFor="input-officer-name"
                className="block font-semibold text-slate-700 mb-1"
              >
                Name of the officer{' '}
                <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
              </label>
              <input
                id="input-officer-name"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. S. K. Mukherjee, WBCS (Exe.)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            {/* Designation First Line (Optional) */}
            <div>
              <label
                htmlFor="input-designation-line-1"
                className="block font-semibold text-slate-700 mb-1"
              >
                Designation First Line{' '}
                <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
              </label>
              <input
                id="input-designation-line-1"
                type="text"
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                placeholder="e.g. Sub-Divisional Officer"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            {/* Designation Second Line (Optional) */}
            <div>
              <label
                htmlFor="input-designation-line-2"
                className="block font-semibold text-slate-700 mb-1"
              >
                Designation Second Line{' '}
                <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
              </label>
              <input
                id="input-designation-line-2"
                type="text"
                value={line2}
                onChange={(e) => setLine2(e.target.value)}
                placeholder="e.g. & Sub-Divisional Magistrate"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            {/* Designation Third Line (Optional) */}
            <div>
              <label
                htmlFor="input-designation-line-3"
                className="block font-semibold text-slate-700 mb-1"
              >
                Designation Third Line{' '}
                <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
              </label>
              <input
                id="input-designation-line-3"
                type="text"
                value={line3}
                onChange={(e) => setLine3(e.target.value)}
                placeholder="e.g. Tehatta Sub-Division, Nadia"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            {/* Designation Fourth Line (Optional) */}
            <div>
              <label
                htmlFor="input-designation-line-4"
                className="block font-semibold text-slate-700 mb-1"
              >
                Designation Fourth Line{' '}
                <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
              </label>
              <input
                id="input-designation-line-4"
                type="text"
                value={line4}
                onChange={(e) => setLine4(e.target.value)}
                placeholder="e.g. Govt. of West Bengal"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* 4. Real-time Signature Preview Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Signature Live Preview
            </p>
            <div className="bg-white border border-slate-300 rounded p-4 shadow-inner">
              <div className="flex flex-col items-end text-right ml-auto max-w-[280px] text-xs">
                {/* Closing text */}
                {selectedClosing?.trim() ? (
                  <p className="text-slate-800 mb-1 font-medium">{selectedClosing.trim()}</p>
                ) : null}

                {/* Signature visual or space */}
                <div className="h-14 flex items-center justify-end my-1 w-full">
                  {signatureDataUrl ? (
                    <img
                      src={signatureDataUrl}
                      alt="Signature Preview"
                      className="max-h-12 max-w-[150px] object-contain"
                    />
                  ) : (
                    <div className="border border-dashed border-slate-300 rounded px-3 py-1 text-[10px] text-slate-400 font-mono">
                      [Signature space]
                    </div>
                  )}
                </div>

                {/* Name */}
                {nameInput.trim() ? (
                  <p className="font-bold text-slate-900 mt-1">
                    ({nameInput.trim()})
                  </p>
                ) : null}

                {/* Designation 4 Lines */}
                {line1.trim() ? (
                  <p className="text-slate-800 leading-tight">{line1.trim()}</p>
                ) : null}
                {line2.trim() ? (
                  <p className="text-slate-800 leading-tight">{line2.trim()}</p>
                ) : null}
                {line3.trim() ? (
                  <p className="text-slate-800 leading-tight">{line3.trim()}</p>
                ) : null}
                {line4.trim() ? (
                  <p className="text-slate-800 leading-tight">{line4.trim()}</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleReset}
            type="button"
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 font-medium transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              type="button"
              className="px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-200 rounded font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              type="button"
              className="px-4 py-1.5 text-xs bg-emerald-700 hover:bg-emerald-600 text-white rounded font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Save & Apply Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
