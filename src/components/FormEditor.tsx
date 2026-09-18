import React from 'react';
import {
  LetterDocument,
  DocumentType,
  LetterFormatting,
} from '../types';
import {
  Plus,
  Trash2,
  Sliders,
  FileText,
  Building,
  User,
  ListOrdered,
  Layers,
} from 'lucide-react';

interface FormEditorProps {
  document: LetterDocument;
  onChange: (updatedDoc: LetterDocument) => void;
}

export const FormEditor: React.FC<FormEditorProps> = ({ document, onChange }) => {
  const updateField = <K extends keyof LetterDocument>(
    field: K,
    value: LetterDocument[K]
  ) => {
    onChange({
      ...document,
      [field]: value,
    });
  };

  const updateFormatting = <K extends keyof LetterFormatting>(
    field: K,
    value: LetterFormatting[K]
  ) => {
    onChange({
      ...document,
      formatting: {
        ...document.formatting,
        [field]: value,
      },
    });
  };

  // Enclosure helpers
  const handleAddEnclosure = () => {
    const nextIndex = (document.enclosures?.length || 0) + 1;
    const newEnclosures = [
      ...(document.enclosures || []),
      `${nextIndex}. [Enclosure Description]`,
    ];
    updateField('enclosures', newEnclosures);
  };

  const handleRemoveEnclosure = (index: number) => {
    const newEnclosures = (document.enclosures || []).filter((_, i) => i !== index);
    updateField('enclosures', newEnclosures);
  };

  const handleUpdateEnclosure = (index: number, val: string) => {
    const newEnclosures = [...(document.enclosures || [])];
    newEnclosures[index] = val;
    updateField('enclosures', newEnclosures);
  };

  // Copy To helpers
  const handleAddCopyTo = () => {
    const nextIndex = (document.copyTo?.length || 0) + 1;
    const newCopyTo = [
      ...(document.copyTo || []),
      `${nextIndex}. [Designation / Authority, Office], for information.`,
    ];
    updateField('copyTo', newCopyTo);
  };

  const handleRemoveCopyTo = (index: number) => {
    const newCopyTo = (document.copyTo || []).filter((_, i) => i !== index);
    updateField('copyTo', newCopyTo);
  };

  const handleUpdateCopyTo = (index: number, val: string) => {
    const newCopyTo = [...(document.copyTo || [])];
    newCopyTo[index] = val;
    updateField('copyTo', newCopyTo);
  };

  return (
    <div className="space-y-6 text-xs text-slate-800 pb-12">
      {/* 1. Document Classification */}
      <section className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <FileText className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold uppercase tracking-wider text-slate-700">
            Document Header & Memo Details
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-slate-600 mb-1">
              Document Type
            </label>
            <select
              id="input-document-type"
              value={document.documentType}
              onChange={(e) => updateField('documentType', e.target.value as DocumentType)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="official_letter">Official Letter</option>
              <option value="reminder">Reminder Letter</option>
              <option value="notice">Official Notice</option>
              <option value="office_memorandum">Office Memorandum (O.M.)</option>
              <option value="office_order">Office Order</option>
              <option value="request_letter">Request / Requisition Letter</option>
              <option value="direction_letter">Direction / Statutory Order</option>
              <option value="show_cause">Show Cause Notice</option>
              <option value="forwarding_letter">Forwarding Letter</option>
              <option value="compliance_letter">Compliance / ATR Letter</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-600 mb-1">
              Doc Name / Letter Title
            </label>
            <input
              id="input-doc-title"
              type="text"
              value={document.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g. Letter to BDO regarding ATR"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-600 mb-1">
              Memo No. / Issue No.
            </label>
            <input
              id="input-memo-no"
              type="text"
              value={document.memoNo}
              onChange={(e) => updateField('memoNo', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g. 142/Dev/SDO/THT or [Memo No.]"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-600 mb-1">
              Date of Issue
            </label>
            <input
              id="input-date"
              type="text"
              value={document.date}
              onChange={(e) => updateField('date', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g. Dated: 17/09/2026 or [Date]"
            />
          </div>
        </div>
      </section>

      {/* 2. Office & Department Details */}
      <section className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <Building className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold uppercase tracking-wider text-slate-700">
            Issuing Office Details
          </h3>
          <span className="text-[10px] text-slate-400 ml-auto">
            (Hidden if official letterhead PDF is uploaded)
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block font-medium text-slate-600 mb-1">
              Office / Department Heading
            </label>
            <textarea
              id="input-office-name"
              rows={2}
              value={document.officeName}
              onChange={(e) => updateField('officeName', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-serif"
              placeholder="GOVERNMENT OF WEST BENGAL&#10;OFFICE OF THE SUB-DIVISIONAL OFFICER, TEHATTA"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-600 mb-1">
                Section / Branch
              </label>
              <input
                id="input-department"
                type="text"
                value={document.department}
                onChange={(e) => updateField('department', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="e.g. DEVELOPMENT & PLANNING WING"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-600 mb-1">
                Office Address & PIN
              </label>
              <input
                id="input-office-address"
                type="text"
                value={document.officeAddress}
                onChange={(e) => updateField('officeAddress', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="e.g. P.O. Tehatta, Dist. Nadia, PIN - 741160"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-600 mb-1">
              Contact Info (Email / Phone)
            </label>
            <input
              id="input-contact-info"
              type="text"
              value={document.contactInfo}
              onChange={(e) => updateField('contactInfo', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g. Email: sdo-tehatta-wb@gov.in | Phone: (03471) 271220"
            />
          </div>
        </div>
      </section>

      {/* 3. Recipient ("To") Details */}
      <section className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <User className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold uppercase tracking-wider text-slate-700">
            Addressee / Recipient ("To")
          </h3>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-600 mb-1">
                Prefix
              </label>
              <input
                id="input-to-prefix"
                type="text"
                value={document.toPrefix}
                onChange={(e) => updateField('toPrefix', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="To"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-600 mb-1">
                Recipient Name (if personal)
              </label>
              <input
                id="input-to-name"
                type="text"
                value={document.toName}
                onChange={(e) => updateField('toName', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="e.g. The Block Development Officer"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-600 mb-1">
                Designation
              </label>
              <input
                id="input-to-designation"
                type="text"
                value={document.toDesignation}
                onChange={(e) => updateField('toDesignation', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="e.g. Block Development Officer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-600 mb-1">
                Office / Institution
              </label>
              <input
                id="input-to-office"
                type="text"
                value={document.toOffice}
                onChange={(e) => updateField('toOffice', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="e.g. Tehatta-I Development Block"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-600 mb-1">
                Recipient Address / Station
              </label>
              <input
                id="input-to-address"
                type="text"
                value={document.toAddress}
                onChange={(e) => updateField('toAddress', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="e.g. P.O. Tehatta, Dist. Nadia"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Subject & Reference */}
      <section className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <ListOrdered className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold uppercase tracking-wider text-slate-700">
            Subject, Reference & Salutation
          </h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block font-medium text-slate-600 mb-1">
              Subject (Sub:)
            </label>
            <textarea
              id="input-subject"
              rows={2}
              value={document.subject}
              onChange={(e) => updateField('subject', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g. Submission of action taken report on rural infrastructure..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-600 mb-1">
                Reference (Ref:)
              </label>
              <input
                id="input-reference"
                type="text"
                value={document.reference}
                onChange={(e) => updateField('reference', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 italic focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="e.g. Memo No. 98/Dev/SDO/THT dated 12/08/2026"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-600 mb-1">
                Salutation
              </label>
              <input
                id="input-salutation"
                type="text"
                value={document.salutation}
                onChange={(e) => updateField('salutation', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="e.g. Madam / Sir, or Sir,"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Body of Letter */}
      <section className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold uppercase tracking-wider text-slate-700">
              Body of Letter
            </h3>
          </div>
          <span className="text-[10px] text-slate-500">
            (Separate paragraphs with a blank line)
          </span>
        </div>

        <div>
          <textarea
            id="input-letter-body"
            rows={10}
            value={document.body}
            onChange={(e) => updateField('body', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 leading-relaxed font-serif text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="1. In inviting reference to the subject cited above...&#10;&#10;2. It is noted that...&#10;&#10;3. You are hereby directed to..."
          />
        </div>
      </section>

      {/* 6. Closing & Issuing Authority */}
      <section className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <User className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold uppercase tracking-wider text-slate-700">
            Closing & Issuing Authority
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-medium text-slate-700">
                Closing
              </label>
              <span className="text-xs text-slate-400">Select one option</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'form-opt-faithfully', label: 'Yours Faithfully', value: 'Yours faithfully,' },
                { id: 'form-opt-truly', label: 'Yours Truly', value: 'Yours truly,' },
                { id: 'form-opt-sincerely', label: 'Yours Sincerely', value: 'Yours sincerely,' },
                { id: 'form-opt-blank', label: 'Blank', value: '' },
              ].map((opt) => {
                const checked =
                  opt.value === ''
                    ? !document.closing || document.closing.trim() === ''
                    : (document.closing?.trim().toLowerCase().startsWith(opt.value.trim().toLowerCase().replace(',', '')) ?? false);
                return (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition select-none ${
                      checked
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={opt.id}
                      checked={checked}
                      onChange={() => {
                        if (checked) {
                          if (opt.value !== '') {
                            updateField('closing', '');
                          }
                        } else {
                          updateField('closing', opt.value);
                        }
                      }}
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                    />
                    <span className="text-xs">{opt.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="input-signatory-name" className="block font-medium text-slate-700 mb-1">
              Name of the officer <span className="text-slate-400 font-normal text-xs">(Optional)</span>
            </label>
            <input
              id="input-signatory-name"
              type="text"
              value={document.signatoryName}
              onChange={(e) => updateField('signatoryName', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g. S. K. Mukherjee, WBCS (Exe.)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="input-signatory-desig-1" className="block font-medium text-slate-700 mb-1">
                Designation First Line <span className="text-slate-400 font-normal text-xs">(Optional)</span>
              </label>
              <input
                id="input-signatory-desig-1"
                type="text"
                value={document.signatoryDesignationLine1 ?? document.signatoryDesignation ?? ''}
                onChange={(e) => {
                  onChange({
                    ...document,
                    signatoryDesignation: e.target.value,
                    signatoryDesignationLine1: e.target.value,
                  });
                }}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="e.g. Sub-Divisional Officer"
              />
            </div>

            <div>
              <label htmlFor="input-signatory-desig-2" className="block font-medium text-slate-700 mb-1">
                Designation Second Line <span className="text-slate-400 font-normal text-xs">(Optional)</span>
              </label>
              <input
                id="input-signatory-desig-2"
                type="text"
                value={document.signatoryDesignationLine2 ?? ''}
                onChange={(e) => updateField('signatoryDesignationLine2', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="e.g. & Sub-Divisional Magistrate"
              />
            </div>

            <div>
              <label htmlFor="input-signatory-desig-3" className="block font-medium text-slate-700 mb-1">
                Designation Third Line <span className="text-slate-400 font-normal text-xs">(Optional)</span>
              </label>
              <input
                id="input-signatory-desig-3"
                type="text"
                value={document.signatoryDesignationLine3 ?? ''}
                onChange={(e) => updateField('signatoryDesignationLine3', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="e.g. Tehatta Sub-Division, Nadia"
              />
            </div>

            <div>
              <label htmlFor="input-signatory-desig-4" className="block font-medium text-slate-700 mb-1">
                Designation Fourth Line <span className="text-slate-400 font-normal text-xs">(Optional)</span>
              </label>
              <input
                id="input-signatory-desig-4"
                type="text"
                value={document.signatoryDesignationLine4 ?? ''}
                onChange={(e) => updateField('signatoryDesignationLine4', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="e.g. Govt. of West Bengal"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Enclosures */}
      <section className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold uppercase tracking-wider text-slate-700">
              Enclosures
            </h3>
          </div>
          <button
            id="btn-add-enclosure"
            onClick={handleAddEnclosure}
            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200"
          >
            <Plus className="w-3 h-3" /> Add Enclosure
          </button>
        </div>

        <div className="space-y-2">
          {(!document.enclosures || document.enclosures.length === 0) && (
            <p className="text-slate-400 text-[11px] italic">No enclosures specified.</p>
          )}
          {document.enclosures?.map((enc, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={enc}
                onChange={(e) => handleUpdateEnclosure(idx, e.target.value)}
                className="flex-1 px-2.5 py-1 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleRemoveEnclosure(idx)}
                className="p-1 text-slate-400 hover:text-rose-600 transition"
                title="Remove enclosure"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Copy To / Endorsement */}
      <section className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold uppercase tracking-wider text-slate-700">
              Copy To (Distribution List)
            </h3>
          </div>
          <button
            id="btn-add-copy-to"
            onClick={handleAddCopyTo}
            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200"
          >
            <Plus className="w-3 h-3" /> Add Copy
          </button>
        </div>

        <div className="space-y-2">
          {(!document.copyTo || document.copyTo.length === 0) && (
            <p className="text-slate-400 text-[11px] italic">No distribution list.</p>
          )}
          {document.copyTo?.map((copy, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={copy}
                onChange={(e) => handleUpdateCopyTo(idx, e.target.value)}
                className="flex-1 px-2.5 py-1 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleRemoveCopyTo(idx)}
                className="p-1 text-slate-400 hover:text-rose-600 transition"
                title="Remove copy"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Formatting & Layout Controls */}
      <section className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <Sliders className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold uppercase tracking-wider text-slate-700">
            Document Typography & Margins
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block font-medium text-slate-600 mb-1">Font Family</label>
            <select
              value={document.formatting.fontFamily}
              onChange={(e) => updateFormatting('fontFamily', e.target.value as any)}
              className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs"
            >
              <option value="times">Times New Roman (Serif)</option>
              <option value="georgia">Georgia (Serif)</option>
              <option value="arial">Arial / Helvetica (Sans)</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-600 mb-1">
              Font Size: {document.formatting.fontSize} pt
            </label>
            <input
              type="range"
              min={10}
              max={15}
              step={1}
              value={document.formatting.fontSize}
              onChange={(e) => updateFormatting('fontSize', Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-600 mb-1">
              Line Spacing: {document.formatting.lineSpacing}
            </label>
            <input
              type="range"
              min={1.2}
              max={1.8}
              step={0.05}
              value={document.formatting.lineSpacing}
              onChange={(e) => updateFormatting('lineSpacing', Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-600 mb-1">
              Letterhead Spacing: {document.formatting.letterheadTopOffsetMm} mm
            </label>
            <input
              type="range"
              min={10}
              max={80}
              step={2}
              value={document.formatting.letterheadTopOffsetMm}
              onChange={(e) => updateFormatting('letterheadTopOffsetMm', Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={document.formatting.subjectStyle.underline}
              onChange={(e) =>
                updateFormatting('subjectStyle', {
                  ...document.formatting.subjectStyle,
                  underline: e.target.checked,
                })
              }
              className="rounded text-emerald-600"
            />
            <span>Underline Subject</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={document.formatting.subjectStyle.bold}
              onChange={(e) =>
                updateFormatting('subjectStyle', {
                  ...document.formatting.subjectStyle,
                  bold: e.target.checked,
                })
              }
              className="rounded text-emerald-600"
            />
            <span>Bold Subject</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={document.formatting.showEmblem}
              onChange={(e) => updateFormatting('showEmblem', e.target.checked)}
              className="rounded text-emerald-600"
            />
            <span>Show State Emblem</span>
          </label>
        </div>
      </section>
    </div>
  );
};
