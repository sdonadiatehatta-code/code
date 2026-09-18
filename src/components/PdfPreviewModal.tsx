import React from 'react';
import {
  X,
  Download,
  Printer,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfBlobUrl: string | null;
  fileName: string;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  pdfBlobUrl,
  fileName,
}) => {
  if (!isOpen || !pdfBlobUrl) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = pdfBlobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    const iframe = document.getElementById('pdf-preview-frame') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.print();
    } else {
      window.open(pdfBlobUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-2 sm:p-4">
      <div className="bg-white w-full max-w-5xl h-[94vh] rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="font-semibold text-sm">
                Generated Official Letter
              </h2>
              <p className="text-[11px] text-slate-400 font-mono truncate max-w-sm sm:max-w-md">
                {fileName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium border border-slate-700 transition"
              title="Print document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold shadow-xs transition"
              title="Download PDF file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded transition ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Success Status Banner */}
        <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-1.5 flex items-center justify-between text-xs text-emerald-800 shrink-0">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium">
              Document ready for download and print.
            </span>
          </div>
        </div>

        {/* PDF Frame */}
        <div className="flex-1 bg-slate-200 p-2 sm:p-4 flex items-center justify-center overflow-hidden">
          <iframe
            id="pdf-preview-frame"
            src={pdfBlobUrl}
            title="PDF Preview"
            className="w-full h-full rounded shadow-md border border-slate-300 bg-white"
          />
        </div>
      </div>
    </div>
  );
};
