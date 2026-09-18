export type DocumentType =
  | 'official_letter'
  | 'reminder'
  | 'notice'
  | 'office_memorandum'
  | 'office_order'
  | 'request_letter'
  | 'direction_letter'
  | 'show_cause'
  | 'forwarding_letter'
  | 'compliance_letter';

export interface LetterFormatting {
  fontFamily: 'times' | 'georgia' | 'arial';
  fontSize: number; // in pt (e.g. 11, 12, 13)
  lineSpacing: number; // e.g. 1.25, 1.4, 1.5, 1.6
  paragraphSpacing: number; // in px (e.g. 8, 12, 16)
  margins: {
    top: number; // in mm
    bottom: number;
    left: number;
    right: number;
  };
  textAlign: 'justify' | 'left';
  subjectStyle: {
    bold: boolean;
    underline: boolean;
    uppercase: boolean;
  };
  referenceStyle: {
    italic: boolean;
    bold: boolean;
  };
  showEmblem: boolean;
  letterheadTopOffsetMm: number; // Push content down if letterhead takes space
  signatureScale: number; // 40 to 160%
  signatureOffsetX: number; // -100 to 100 px
  signatureOffsetY: number; // -50 to 50 px
  signatureAlignment: 'right' | 'center' | 'left';
}

export interface LetterDocument {
  id: string;
  title: string;
  documentType: DocumentType;
  officeName: string;
  department: string;
  officeAddress: string;
  contactInfo: string;
  memoNo: string;
  date: string;
  toPrefix: string;
  toName: string;
  toDesignation: string;
  toOffice: string;
  toAddress: string;
  subject: string;
  reference: string;
  salutation: string;
  body: string;
  closing: string;
  signatoryName: string;
  signatoryDesignation: string;
  signatoryDesignationLine1?: string;
  signatoryDesignationLine2?: string;
  signatoryDesignationLine3?: string;
  signatoryDesignationLine4?: string;
  signatoryOffice: string;
  enclosures: string[];
  copyTo: string[];
  formatting: LetterFormatting;
  letterheadConfig?: TextLetterheadConfig;
}

export interface TextLetterheadConfig {
  includeAshokaStambh?: boolean;
  includeAshokChakra?: boolean;
  emblemDataUrl?: string; // Base64 data URL of uploaded emblem
  line1: string; // Letter head text first line
  line2?: string; // Letter head text second line
  line3?: string; // Letter head text third line
  line4?: string; // Letter head text fourth line
  email?: string; // Email ID of the office
  telephone?: string; // Telephone of the office
}

export interface LetterheadAsset {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'word';
  dataUrl: string; // Base64 data URL
  pdfBytesBase64?: string; // For pdf-lib merging
  wordBytesBase64?: string; // Original Word document binary if uploaded as docx
  previewImageUrl?: string; // For canvas/HTML preview
  isDefault?: boolean;
  createdAt: string;
}

export interface SignatureAsset {
  id: string;
  name: string;
  dataUrl: string; // Base64 image
  isDefault?: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  modifiedFields?: string[];
}

export interface UserSettings {
  defaultOfficeName: string;
  defaultDepartment: string;
  defaultOfficeAddress: string;
  defaultContactInfo: string;
  defaultSignatoryName: string;
  defaultSignatoryDesignation: string;
  defaultSignatoryOffice: string;
  defaultFontFamily: 'times' | 'georgia' | 'arial';
  defaultFontSize: number;
  defaultMargins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  designation?: string;
}
