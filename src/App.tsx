import React, { useState, useEffect, useRef } from 'react';
import {
  LetterDocument,
  ChatMessage,
  LetterheadAsset,
  SignatureAsset,
  UserSettings,
  UserProfile,
} from './types';
import {
  createBlankDocument,
  DEFAULT_SETTINGS,
  DEFAULT_LETTERHEAD_CONFIG,
} from './data/defaultData';
import { DocumentTemplate } from './data/templates';
import { Header } from './components/Header';
import { AssistantPanel } from './components/AssistantPanel';
import { LivePreviewPanel } from './components/LivePreviewPanel';
import { LetterheadModal } from './components/LetterheadModal';
import { LetterheadSettingsModal } from './components/LetterheadSettingsModal';
import { SignatureModal } from './components/SignatureModal';
import { TemplatesModal } from './components/TemplatesModal';
import { SettingsModal } from './components/SettingsModal';
import { PdfPreviewModal } from './components/PdfPreviewModal';
import { ActiveAssetViewerModal } from './components/ActiveAssetViewerModal';
import { generateOfficialLetterPdf } from './utils/pdfGenerator';
import { generateOfficialLetterDocx } from './utils/wordGenerator';
import { processUniversalLetterheadFile, fileToDataUrl } from './utils/letterheadRenderer';

const STORAGE_KEYS = {
  DOCUMENT: 'ola_current_document_v1',
  MESSAGES: 'ola_chat_messages_v1',
  LETTERHEADS: 'ola_saved_letterheads_v1',
  ACTIVE_LETTERHEAD: 'ola_active_letterhead_v1',
  SIGNATURES: 'ola_saved_signatures_v1',
  ACTIVE_SIGNATURE: 'ola_active_signature_v1',
  SETTINGS: 'ola_user_settings_v1',
  USER_PROFILE: 'ola_user_profile_v1',
};

export const App: React.FC = () => {
  // --- Current User Profile (Dynamic, ready for auth/login) ---
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      id: 'usr-official-001',
      name: 'Abhijit Ray',
      email: 'sdonadiatehatta@gmail.com',
      designation: 'Officer in Charge',
    };
  });

  // --- Persistent State Initialization ---
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SETTINGS;
  });

  const [document, setDocument] = useState<LetterDocument>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOCUMENT);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clear any old hard-coded sample letter content
        if (
          parsed.id === 'doc-initial-001' ||
          parsed.memoNo === '142/Dev/SDO/THT' ||
          parsed.subject?.includes('Submission of comprehensive action taken report') ||
          parsed.body?.includes('In inviting reference to the subject cited above, I am directed to state that the progress report')
        ) {
          const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
          const activeSettings = savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
          return createBlankDocument(activeSettings);
        }
        return parsed;
      }
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const activeSettings = savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
      return createBlankDocument(activeSettings);
    } catch {
      return createBlankDocument(DEFAULT_SETTINGS);
    }
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: 'Official Letter Assistant ready. You can instruct me in natural language or by voice to draft, revise, or format your official letter.',
        timestamp: 'Just now',
      },
    ];
  });

  const [savedLetterheads, setSavedLetterheads] = useState<LetterheadAsset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LETTERHEADS);
      if (saved) {
        const list = JSON.parse(saved);
        return list.filter((lh: LetterheadAsset) => lh.id !== 'lh-sample-1');
      }
    } catch {}
    return [];
  });

  const [activeLetterhead, setActiveLetterhead] = useState<LetterheadAsset | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_LETTERHEAD);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.id === 'lh-sample-1') return null;
        return parsed;
      }
    } catch {}
    return null;
  });

  const [savedSignatures, setSavedSignatures] = useState<SignatureAsset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SIGNATURES);
      if (saved) {
        const list = JSON.parse(saved);
        return list.filter((sig: SignatureAsset) => sig.id !== 'sig-sample-1');
      }
    } catch {}
    return [];
  });

  const [activeSignature, setActiveSignature] = useState<SignatureAsset | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_SIGNATURE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.id === 'sig-sample-1') return null;
        return parsed;
      }
    } catch {}
    return null;
  });

  // --- Modals and Active Viewers ---
  const [viewAssetModal, setViewAssetModal] = useState<'letterhead' | 'signature' | null>(null);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showLetterheadSettingsModal, setShowLetterheadSettingsModal] = useState(false);
  const [showLetterheadModal, setShowLetterheadModal] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  // Hidden file inputs for direct one-click upload
  const letterheadFileInputRef = useRef<HTMLInputElement>(null);
  const signatureFileInputRef = useRef<HTMLInputElement>(null);

  // --- LocalStorage Auto-Sync ---
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCUMENT, JSON.stringify(document));
  }, [document]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LETTERHEADS, JSON.stringify(savedLetterheads));
  }, [savedLetterheads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_LETTERHEAD, JSON.stringify(activeLetterhead));
  }, [activeLetterhead]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIGNATURES, JSON.stringify(savedSignatures));
  }, [savedSignatures]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SIGNATURE, JSON.stringify(activeSignature));
  }, [activeSignature]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfBlobUrl]);

  // --- Editable Title / Letter Name ---
  const handleUpdateTitle = (newTitle: string) => {
    setDocument((prev) => ({
      ...prev,
      title: newTitle,
    }));
  };

  // --- Upload Letterhead directly (Supports Word .docx/.doc, PDF .pdf, and Image) ---
  const handleLetterheadFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      setSavedLetterheads((prev) => [newLh, ...prev]);
      setActiveLetterhead(newLh);
    } catch (err: any) {
      console.error('Error processing letterhead upload:', err);
      alert('Failed to process letterhead file: ' + (err.message || 'Unknown error'));
    } finally {
      if (letterheadFileInputRef.current) letterheadFileInputRef.current.value = '';
    }
  };

  // --- Upload Signature directly ---
  const handleSignatureFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a scanned signature image (PNG, JPG, or JPEG).');
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      const newSig: SignatureAsset = {
        id: `sig-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        dataUrl,
        createdAt: new Date().toISOString(),
      };
      setSavedSignatures((prev) => [newSig, ...prev]);
      setActiveSignature(newSig);
    } catch (err: any) {
      console.error('Error uploading signature:', err);
      alert('Failed to read signature image.');
    } finally {
      if (signatureFileInputRef.current) signatureFileInputRef.current.value = '';
    }
  };

  // --- AI Drafting Handler ---
  const handleSendMessage = async (instruction: string) => {
    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: instruction,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsAiLoading(true);

    try {
      const response = await fetch('/api/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: instruction,
          currentDocument: document,
          conversationHistory: messages.slice(-8),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();

      if (data.document) {
        setDocument((prev) => {
          const currentTitle = prev.title?.trim();
          let updatedTitle = currentTitle;

          // If AI provided a specific title or if title is untitled
          if (data.document.title && (!currentTitle || currentTitle === 'Untitled Letter')) {
            updatedTitle = data.document.title.replace(/^doc\s*name\s*:\s*/i, '').trim();
          } else if (!currentTitle || currentTitle === 'Untitled Letter') {
            if (data.document.toDesignation && data.document.subject) {
              const cleanSubj = data.document.subject.replace(/^(Sub:|Subject:)\s*/i, '').trim();
              updatedTitle = `Letter to ${data.document.toDesignation} regarding ${cleanSubj.slice(0, 40)}`;
            } else if (data.document.subject) {
              const cleanSubj = data.document.subject.replace(/^(Sub:|Subject:)\s*/i, '').trim();
              updatedTitle = `Letter regarding ${cleanSubj.slice(0, 50)}`;
            }
          }

          return {
            ...prev,
            ...data.document,
            title: updatedTitle || 'Untitled Letter',
            // Preserve user-configured formatting unless explicitly modified
            formatting: {
              ...prev.formatting,
              ...(data.document.formatting || {}),
            },
          };
        });
      }

      const assistantMessage: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: data.assistantMessage || 'The official draft has been updated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Error drafting with AI:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `Unable to process drafting request: ${err.message || 'Network error'}. Please try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // --- New Letter Action ---
  const handleNewLetter = () => {
    if (
      window.confirm(
        'Start a new blank official letter? The document will start clean, retaining only information explicitly saved in Settings (such as office name, address, designation, letterhead, and signature).'
      )
    ) {
      setDocument(createBlankDocument(settings));
      setMessages([
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: 'Clean blank official document initialized. Instruct me to draft or modify any section.',
          timestamp: 'Just now',
        },
      ]);
    }
  };

  // --- Template Application ---
  const handleApplyTemplate = (template: DocumentTemplate) => {
    setDocument((prev) => ({
      ...createBlankDocument(settings),
      ...template.defaultData,
      documentType: template.documentType,
      title: template.name,
      // Retain active office defaults explicitly saved by user in settings
      officeName: settings.defaultOfficeName || prev.officeName || template.defaultData.officeName || '',
      department: settings.defaultDepartment || prev.department || template.defaultData.department || '',
      officeAddress: settings.defaultOfficeAddress || prev.officeAddress || template.defaultData.officeAddress || '',
      contactInfo: settings.defaultContactInfo || prev.contactInfo || template.defaultData.contactInfo || '',
      signatoryName: settings.defaultSignatoryName || prev.signatoryName || '',
      signatoryDesignation:
        settings.defaultSignatoryDesignation || prev.signatoryDesignation || template.defaultData.signatoryDesignation || '',
      signatoryOffice: settings.defaultSignatoryOffice || prev.signatoryOffice || '',
    }));

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Applied "${template.name}" template.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // --- Settings Application ---
  const handleApplySettingsToCurrent = (newSettings: UserSettings) => {
    setSettings(newSettings);
    setDocument((prev) => ({
      ...prev,
      officeName: newSettings.defaultOfficeName || prev.officeName,
      department: newSettings.defaultDepartment || prev.department,
      officeAddress: newSettings.defaultOfficeAddress || prev.officeAddress,
      contactInfo: newSettings.defaultContactInfo || prev.contactInfo,
      signatoryName: newSettings.defaultSignatoryName || prev.signatoryName,
      signatoryDesignation:
        newSettings.defaultSignatoryDesignation || prev.signatoryDesignation,
      signatoryOffice: newSettings.defaultSignatoryOffice || prev.signatoryOffice,
      formatting: {
        ...prev.formatting,
        fontFamily: newSettings.defaultFontFamily,
        fontSize: newSettings.defaultFontSize,
        margins: newSettings.defaultMargins,
      },
    }));
  };

  // --- Document Filename Helper ---
  const getDocumentBaseFileName = () => {
    const rawTitle = (document.title || '').trim() || 'Untitled Letter';
    const cleanTitle = rawTitle.replace(/[\\/:*?"<>|]/g, '').trim();
    return cleanTitle || 'Untitled_Letter';
  };

  // --- PDF Compilation ---
  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const pdfBytes = await generateOfficialLetterPdf(
        document,
        activeLetterhead,
        activeSignature
      );

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
      const newUrl = URL.createObjectURL(blob);
      setPdfBlobUrl(newUrl);
      setShowPdfModal(true);
    } catch (err: any) {
      console.error('Error generating PDF:', err);
      alert('Could not generate PDF: ' + (err.message || 'Unknown error'));
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // --- Word (.docx) Compilation ---
  const handleGenerateDocx = async () => {
    setIsGeneratingDocx(true);
    try {
      const docxBlob = await generateOfficialLetterDocx(
        document,
        activeLetterhead,
        activeSignature
      );
      const url = URL.createObjectURL(docxBlob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${getDocumentBaseFileName()}.docx`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error generating Word document:', err);
      alert('Could not generate Word document: ' + (err.message || 'Unknown error'));
    } finally {
      setIsGeneratingDocx(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans antialiased select-auto">
      {/* 
        TOP HEADER: 
        [Current User] | Doc Name : [Letter Name] [Edit]
        [New Letter] [Letterhead Settings] [Signature] [Generate Final Document]
      */}
      <Header
        document={document}
        onUpdateTitle={handleUpdateTitle}
        currentUser={currentUser}
        onNewLetter={handleNewLetter}
        onOpenLetterheadSettings={() => setShowLetterheadSettingsModal(true)}
        onUploadLetterheadClick={() => letterheadFileInputRef.current?.click()}
        onOpenLetterheadModal={() => setShowLetterheadModal(true)}
        onViewActiveLetterhead={() => setViewAssetModal('letterhead')}
        onUploadSignatureClick={() => signatureFileInputRef.current?.click()}
        onOpenSignatureModal={() => setShowSignatureModal(true)}
        onViewActiveSignature={() => setViewAssetModal('signature')}
        onGeneratePdf={handleGeneratePdf}
        onGenerateDocx={handleGenerateDocx}
        isGeneratingPdf={isGeneratingPdf}
        isGeneratingDocx={isGeneratingDocx}
        hasLetterhead={!!activeLetterhead}
        hasSignature={!!activeSignature}
      />

      {/* Main Two-Panel Workspace */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT PANEL: AI Conversation & Two Direct Control Fields (Memo No. & Date) */}
        <AssistantPanel
          document={document}
          onDocumentChange={(updated) => setDocument((prev) => ({ ...prev, ...updated }))}
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isAiLoading}
        />

        {/* RIGHT PANEL: Live Preview with Zoom */}
        <LivePreviewPanel
          document={document}
          letterhead={activeLetterhead}
          signature={activeSignature}
        />
      </main>

      {/* Hidden File Inputs for Simple Header Upload Actions */}
      <input
        type="file"
        ref={letterheadFileInputRef}
        onChange={handleLetterheadFileUpload}
        accept=".docx,.doc,.pdf,.png,.jpg,.jpeg,.DOCX,.DOC,.PDF,.PNG,.JPG,.JPEG"
        className="hidden"
      />
      <input
        type="file"
        ref={signatureFileInputRef}
        onChange={handleSignatureFileUpload}
        accept=".png,.jpg,.jpeg,.PNG,.JPG,.JPEG,image/png,image/jpeg,image/jpg"
        className="hidden"
      />

      {/* Minimalist Active Asset Viewer Modal */}
      <ActiveAssetViewerModal
        isOpen={viewAssetModal !== null}
        onClose={() => setViewAssetModal(null)}
        type={viewAssetModal || 'letterhead'}
        letterhead={activeLetterhead}
        signature={activeSignature}
        onUploadNew={() => {
          if (viewAssetModal === 'letterhead') {
            letterheadFileInputRef.current?.click();
          } else {
            signatureFileInputRef.current?.click();
          }
        }}
        onRemove={() => {
          if (viewAssetModal === 'letterhead') {
            setActiveLetterhead(null);
          } else {
            setActiveSignature(null);
          }
        }}
      />

      {/* Retained Underlying Modals for Template & Settings */}
      <LetterheadSettingsModal
        isOpen={showLetterheadSettingsModal}
        onClose={() => setShowLetterheadSettingsModal(false)}
        config={document.letterheadConfig || DEFAULT_LETTERHEAD_CONFIG}
        onSave={(newConfig) => {
          setDocument((prev) => ({
            ...prev,
            letterheadConfig: newConfig,
          }));
        }}
      />

      <TemplatesModal
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
        onApplyTemplate={handleApplyTemplate}
        currentDocType={document.documentType}
      />

      <LetterheadModal
        isOpen={showLetterheadModal}
        onClose={() => setShowLetterheadModal(false)}
        currentLetterhead={activeLetterhead}
        savedLetterheads={savedLetterheads}
        onSelectLetterhead={(lh) => setActiveLetterhead(lh)}
        onSaveAsDefault={(lh) => {
          setSavedLetterheads((prev) =>
            prev.map((item) => ({
              ...item,
              isDefault: item.id === lh.id,
            }))
          );
        }}
        onDeleteLetterhead={(id) => {
          setSavedLetterheads((prev) => prev.filter((item) => item.id !== id));
          if (activeLetterhead?.id === id) setActiveLetterhead(null);
        }}
        onAddLetterhead={(newLh) => {
          setSavedLetterheads((prev) => [newLh, ...prev]);
        }}
        document={document}
        onUpdateOffset={(offset) => {
          setDocument((prev) => ({
            ...prev,
            formatting: {
              ...prev.formatting,
              letterheadTopOffsetMm: offset,
            },
          }));
        }}
      />

      <SignatureModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        currentSignature={activeSignature}
        closing={document.closing}
        officerName={document.signatoryName || ''}
        designationLine1={document.signatoryDesignationLine1 ?? document.signatoryDesignation ?? ''}
        designationLine2={document.signatoryDesignationLine2 ?? ''}
        designationLine3={document.signatoryDesignationLine3 ?? ''}
        designationLine4={document.signatoryDesignationLine4 ?? ''}
        onSave={(data) => {
          if (data.signatureDataUrl) {
            const newSig: SignatureAsset = {
              id: activeSignature?.id || `sig-${Date.now()}`,
              name: data.officerName ? `${data.officerName} Signature` : 'Official Signature',
              dataUrl: data.signatureDataUrl,
              createdAt: new Date().toISOString(),
            };
            setActiveSignature(newSig);
            setSavedSignatures((prev) => {
              const exists = prev.some((s) => s.dataUrl === data.signatureDataUrl);
              return exists ? prev : [newSig, ...prev];
            });
          } else {
            setActiveSignature(null);
          }
          setDocument((prev) => ({
            ...prev,
            closing: data.closing,
            signatoryName: data.officerName,
            signatoryDesignation: data.designationLine1,
            signatoryDesignationLine1: data.designationLine1,
            signatoryDesignationLine2: data.designationLine2,
            signatoryDesignationLine3: data.designationLine3,
            signatoryDesignationLine4: data.designationLine4,
          }));
        }}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={settings}
        onSaveSettings={setSettings}
        onApplyToCurrent={handleApplySettingsToCurrent}
      />

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        pdfBlobUrl={pdfBlobUrl}
        fileName={`${getDocumentBaseFileName()}.pdf`}
      />
    </div>
  );
};

export default App;
