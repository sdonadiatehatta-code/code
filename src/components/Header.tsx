import React, { useState, useRef, useEffect } from 'react';
import {
  PlusCircle,
  Upload,
  Eye,
  Pencil,
  ChevronDown,
  Download,
  FileText,
  FileDown,
  Check,
  FolderOpen,
} from 'lucide-react';
import { LetterDocument, UserProfile } from '../types';

interface HeaderProps {
  document: LetterDocument;
  onUpdateTitle: (newTitle: string) => void;
  currentUser: UserProfile;
  onNewLetter: () => void;
  onOpenLetterheadSettings: () => void;
  onUploadLetterheadClick?: () => void;
  onOpenLetterheadModal?: () => void;
  onViewActiveLetterhead?: () => void;
  onUploadSignatureClick: () => void;
  onOpenSignatureModal?: () => void;
  onViewActiveSignature: () => void;
  onGeneratePdf: () => void;
  onGenerateDocx: () => void;
  isGeneratingPdf: boolean;
  isGeneratingDocx: boolean;
  hasLetterhead: boolean;
  hasSignature: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  document,
  onUpdateTitle,
  currentUser,
  onNewLetter,
  onOpenLetterheadSettings,
  onUploadLetterheadClick,
  onOpenLetterheadModal,
  onViewActiveLetterhead,
  onUploadSignatureClick,
  onOpenSignatureModal,
  onViewActiveSignature,
  onGeneratePdf,
  onGenerateDocx,
  isGeneratingPdf,
  isGeneratingDocx,
  hasLetterhead,
  hasSignature,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(document.title || 'Untitled Letter');
  const [showLetterheadMenu, setShowLetterheadMenu] = useState(false);
  const [showSignatureMenu, setShowSignatureMenu] = useState(false);
  const [showGenerateMenu, setShowGenerateMenu] = useState(false);

  const letterheadMenuRef = useRef<HTMLDivElement>(null);
  const signatureMenuRef = useRef<HTMLDivElement>(null);
  const generateMenuRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Sync title when document.title changes externally
  useEffect(() => {
    const raw = document.title || 'Untitled Letter';
    const clean = raw.replace(/^doc\s*name\s*:\s*/i, '').trim() || 'Untitled Letter';
    setTitleInput(clean);
  }, [document.title]);

  // Focus title input when editing starts
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  // Click outside listener for all dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        letterheadMenuRef.current &&
        !letterheadMenuRef.current.contains(event.target as Node)
      ) {
        setShowLetterheadMenu(false);
      }
      if (
        signatureMenuRef.current &&
        !signatureMenuRef.current.contains(event.target as Node)
      ) {
        setShowSignatureMenu(false);
      }
      if (
        generateMenuRef.current &&
        !generateMenuRef.current.contains(event.target as Node)
      ) {
        setShowGenerateMenu(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveTitle = () => {
    let trimmed = titleInput.trim();
    if (/^doc\s*name\s*:\s*/i.test(trimmed)) {
      trimmed = trimmed.replace(/^doc\s*name\s*:\s*/i, '').trim();
    }
    const finalTitle = trimmed || 'Untitled Letter';
    onUpdateTitle(finalTitle);
    setTitleInput(finalTitle);
    setIsEditingTitle(false);
  };

  const handleCancelTitle = () => {
    const raw = document.title || 'Untitled Letter';
    const clean = raw.replace(/^doc\s*name\s*:\s*/i, '').trim() || 'Untitled Letter';
    setTitleInput(clean);
    setIsEditingTitle(false);
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-md sticky top-0 z-40">
      <div className="max-w-[1800px] mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* TOP LEFT: [User Account] | Doc Name : [Letter Name] [Edit] [New Letter] */}
        <div className="flex items-center gap-2.5 flex-wrap min-w-0 text-xs sm:text-sm">
          {/* 1. Current User Name */}
          <span className="font-semibold text-slate-200 whitespace-nowrap text-xs">
            User: {currentUser.name || 'Official Account'}
          </span>

          <span className="text-slate-600 select-none">|</span>

          {/* 2. Document / Letter Name formatted with [Edit] */}
          {isEditingTitle ? (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-300 font-medium text-xs whitespace-nowrap">
                Doc Name :
              </span>
              <input
                ref={titleInputRef}
                id="input-header-doc-name"
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') handleCancelTitle();
                }}
                className="bg-slate-800 text-slate-100 text-xs px-2 py-0.5 rounded border border-emerald-500/80 focus:outline-none w-48 sm:w-64 md:w-80 shadow-inner"
                placeholder="Untitled Letter"
                title="Enter letter name (used as PDF/Word filename)"
              />
              <button
                id="btn-save-doc-name"
                type="button"
                onClick={handleSaveTitle}
                className="px-2 py-0.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                id="header-doc-name-display"
                className="text-slate-300 truncate max-w-[200px] sm:max-w-[300px] md:max-w-md lg:max-w-lg font-normal"
                title={`Doc Name : ${document.title?.trim() || 'Untitled Letter'}`}
              >
                <span className="text-slate-300 font-medium">Doc Name : </span>
                <span className="text-slate-100 font-semibold">{document.title?.trim() || 'Untitled Letter'}</span>
              </span>
              <button
                id="btn-edit-doc-name"
                type="button"
                onClick={() => setIsEditingTitle(true)}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition shrink-0 cursor-pointer"
                title="Edit letter name (used as PDF/Word filename)"
              >
                <Pencil className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>
          )}

          {/* 3. New Letter Button on the side of Doc Name & Edit */}
          <button
            id="btn-new-letter"
            onClick={onNewLetter}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-100 rounded border border-slate-700 transition cursor-pointer shadow-xs ml-1"
            title="Start a new blank official letter"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>New Letter</span>
          </button>
        </div>

        {/* TOP RIGHT: [Letterhead (blue)] [Signature (blue)] [Generate Final Document (green)] */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Letterhead Button - Blue button with white text */}
          <button
            id="btn-letterhead"
            onClick={onOpenLetterheadSettings}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded shadow-xs transition cursor-pointer"
            title="Configure or Upload Letterhead"
          >
            <span>Letterhead</span>
          </button>

          {/* Signature Button - Blue button with white text */}
          <button
            id="btn-open-signature"
            onClick={() => onOpenSignatureModal?.()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded shadow-xs transition cursor-pointer"
            title="Configure Signature, Valediction & Signatory Designation"
          >
            <span>Signature</span>
          </button>

          {/* Generate Final Document Menu - Green button with white text */}
          <div className="relative" ref={generateMenuRef}>
            <button
              id="btn-generate-final-document"
              onClick={() => {
                setShowGenerateMenu(!showGenerateMenu);
                setShowLetterheadMenu(false);
                setShowSignatureMenu(false);
              }}
              disabled={isGeneratingPdf || isGeneratingDocx}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded shadow-xs transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Generate final official document (PDF or Word)"
            >
              {isGeneratingPdf || isGeneratingDocx ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Generate Final Document</span>
                  <ChevronDown className="w-3 h-3 text-emerald-200" />
                </>
              )}
            </button>
              {isGeneratingPdf || isGeneratingDocx ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Generate Final Document</span>
                  <ChevronDown className="w-3 h-3 text-emerald-200" />
                </>
              )}
            </button>

            {showGenerateMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800 text-xs animate-in fade-in zoom-in-95">
                <button
                  onClick={() => {
                    setShowGenerateMenu(false);
                    onGeneratePdf();
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 text-slate-800 font-medium transition"
                >
                  <FileDown className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900">Generate PDF</div>
                    <div className="text-[10px] text-slate-500">Official vector PDF document</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setShowGenerateMenu(false);
                    onGenerateDocx();
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 text-slate-800 font-medium transition border-t border-slate-100"
                >
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900">Generate Word</div>
                    <div className="text-[10px] text-slate-500">Editable .docx document</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
