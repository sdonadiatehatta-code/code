import React, { useState } from 'react';
import { DOCUMENT_TEMPLATES, DocumentTemplate } from '../data/templates';
import { LetterDocument } from '../types';
import {
  Bookmark,
  X,
  Check,
  FileText,
  Search,
  ChevronRight,
} from 'lucide-react';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (template: DocumentTemplate) => void;
  currentDocType: string;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
  currentDocType,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    DOCUMENT_TEMPLATES[0].id
  );

  if (!isOpen) return null;

  const filteredTemplates = DOCUMENT_TEMPLATES.filter((tpl) => {
    const q = searchTerm.toLowerCase();
    return (
      tpl.name.toLowerCase().includes(q) ||
      tpl.description.toLowerCase().includes(q) ||
      tpl.defaultData.subject?.toLowerCase().includes(q)
    );
  });

  const selectedTemplate =
    DOCUMENT_TEMPLATES.find((t) => t.id === selectedTemplateId) ||
    DOCUMENT_TEMPLATES[0];

  const handleApply = (tpl: DocumentTemplate) => {
    onApplyTemplate(tpl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="font-bold text-sm tracking-wide uppercase">
                Government Document Templates
              </h2>
              <p className="text-[11px] text-slate-400">
                10 Standard Indian Government & Govt of West Bengal Administrative Formats
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-2.5 bg-slate-100 border-b border-slate-200 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search templates (e.g., Reminder, Notice, Show Cause, Order, Forwarding)..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Main Grid: List on Left, Preview on Right */}
        <div className="flex-1 flex overflow-hidden">
          {/* Template List */}
          <div className="w-2/5 border-r border-slate-200 overflow-y-auto p-3 space-y-1.5 custom-scrollbar bg-slate-50">
            {filteredTemplates.map((tpl) => {
              const isSelected = tpl.id === selectedTemplateId;
              const isCurrent = tpl.documentType === currentDocType;

              return (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  className={`w-full text-left p-2.5 rounded-lg border transition flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-bold text-xs truncate">{tpl.name}</p>
                    <p
                      className={`text-[10px] line-clamp-1 mt-0.5 ${
                        isSelected ? 'text-emerald-200' : 'text-slate-500'
                      }`}
                    >
                      {tpl.description}
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 ${
                      isSelected ? 'text-emerald-300' : 'text-slate-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Template Preview */}
          <div className="w-3/5 overflow-y-auto p-5 space-y-4 bg-white custom-scrollbar text-xs text-slate-800">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                  {selectedTemplate.documentType.toUpperCase().replace('_', ' ')}
                </span>
                <span className="text-slate-400 text-[11px]">Preview</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                {selectedTemplate.name}
              </h3>
              <p className="text-slate-600 text-xs mt-1">
                {selectedTemplate.description}
              </p>
            </div>

            {/* Structured Preview Box */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5 font-serif">
              <div className="border-b border-slate-200 pb-2">
                <p className="font-bold text-[11px] text-slate-700">Subject Line:</p>
                <p className="font-semibold text-slate-900 text-xs mt-0.5">
                  {selectedTemplate.defaultData.subject}
                </p>
              </div>

              {selectedTemplate.defaultData.reference && (
                <div className="border-b border-slate-200 pb-2">
                  <p className="font-bold text-[11px] text-slate-700">Reference:</p>
                  <p className="italic text-slate-800 text-[11px] mt-0.5">
                    {selectedTemplate.defaultData.reference}
                  </p>
                </div>
              )}

              <div>
                <p className="font-bold text-[11px] text-slate-700 mb-1">Standard Body Draft:</p>
                <div className="bg-white p-2.5 rounded border border-slate-200 text-[11px] text-slate-800 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto custom-scrollbar">
                  {selectedTemplate.defaultData.body}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleApply(selectedTemplate)}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-semibold text-xs transition shadow-sm flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Apply This Template to Letter</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
