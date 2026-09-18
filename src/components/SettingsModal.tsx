import React, { useState } from 'react';
import { UserSettings } from '../types';
import {
  Settings as SettingsIcon,
  X,
  Save,
  Check,
  Building,
  User,
  Sliders,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSaveSettings: (newSettings: UserSettings) => void;
  onApplyToCurrent: (settings: UserSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onApplyToCurrent,
}) => {
  const [formData, setFormData] = useState<UserSettings>({ ...settings });
  const [showSavedToast, setShowSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  const handleApplyAndClose = () => {
    onSaveSettings(formData);
    onApplyToCurrent(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-sm tracking-wide uppercase">
              Office Preferences & Default Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-700 custom-scrollbar">
          {/* Office Defaults */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Building className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Default Office Information
              </h3>
            </div>

            <div>
              <label className="block font-medium text-slate-600 mb-1">
                Default Office Heading
              </label>
              <textarea
                rows={2}
                value={formData.defaultOfficeName}
                onChange={(e) =>
                  setFormData({ ...formData, defaultOfficeName: e.target.value })
                }
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-serif text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  Default Department / Branch
                </label>
                <input
                  type="text"
                  value={formData.defaultDepartment}
                  onChange={(e) =>
                    setFormData({ ...formData, defaultDepartment: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  Default Office Address & PIN
                </label>
                <input
                  type="text"
                  value={formData.defaultOfficeAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, defaultOfficeAddress: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-600 mb-1">
                Default Contact Information
              </label>
              <input
                type="text"
                value={formData.defaultContactInfo}
                onChange={(e) =>
                  setFormData({ ...formData, defaultContactInfo: e.target.value })
                }
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Signatory Defaults */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <User className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Default Issuing Authority
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  Officer Name
                </label>
                <input
                  type="text"
                  value={formData.defaultSignatoryName}
                  onChange={(e) =>
                    setFormData({ ...formData, defaultSignatoryName: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  Official Designation
                </label>
                <input
                  type="text"
                  value={formData.defaultSignatoryDesignation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      defaultSignatoryDesignation: e.target.value,
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  Sub-Division / Station
                </label>
                <input
                  type="text"
                  value={formData.defaultSignatoryOffice}
                  onChange={(e) =>
                    setFormData({ ...formData, defaultSignatoryOffice: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Typography & Margins Defaults */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Sliders className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Default Typography & Margins
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  Font Family
                </label>
                <select
                  value={formData.defaultFontFamily}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      defaultFontFamily: e.target.value as any,
                    })
                  }
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-slate-900"
                >
                  <option value="times">Times New Roman (Standard)</option>
                  <option value="georgia">Georgia</option>
                  <option value="arial">Arial / Helvetica</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  Font Size: {formData.defaultFontSize} pt
                </label>
                <input
                  type="range"
                  min={10}
                  max={14}
                  step={1}
                  value={formData.defaultFontSize}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      defaultFontSize: Number(e.target.value),
                    })
                  }
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  Page Left Margin: {formData.defaultMargins.left} mm
                </label>
                <input
                  type="range"
                  min={15}
                  max={35}
                  step={1}
                  value={formData.defaultMargins.left}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      defaultMargins: {
                        ...formData.defaultMargins,
                        left: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-emerald-600"
                />
              </div>
            </div>
          </div>

          {showSavedToast && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-3 py-2 rounded flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Default preferences saved successfully.</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={handleApplyAndClose}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-medium transition text-xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply to Current Letter & Close</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Defaults</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
