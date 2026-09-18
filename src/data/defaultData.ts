import { LetterDocument, LetterheadAsset, SignatureAsset, UserSettings, TextLetterheadConfig } from '../types';
import { DOCUMENT_TEMPLATES } from './templates';

export const DEFAULT_LETTERHEAD_CONFIG: TextLetterheadConfig = {
  emblemDataUrl: '',
  line1: 'GOVERNMENT OF WEST BENGAL',
  line2: 'OFFICE OF THE SUB-DIVISIONAL OFFICER',
  line3: 'TEHATTA, NADIA',
  line4: '',
  email: 'sdonadiatehatta@gmail.com',
  telephone: '',
};

export const DEFAULT_FORMATTING = {
  fontFamily: 'times' as const,
  fontSize: 12,
  lineSpacing: 1.4,
  paragraphSpacing: 12,
  margins: {
    top: 25,
    bottom: 25,
    left: 25,
    right: 20,
  },
  textAlign: 'justify' as const,
  subjectStyle: {
    bold: true,
    underline: true,
    uppercase: false,
  },
  referenceStyle: {
    italic: true,
    bold: false,
  },
  showEmblem: true,
  letterheadTopOffsetMm: 42,
  signatureScale: 90,
  signatureOffsetX: 0,
  signatureOffsetY: 0,
  signatureAlignment: 'right' as const,
};

export const DEFAULT_USER_SETTINGS: UserSettings = {
  defaultOfficeName: '',
  defaultDepartment: '',
  defaultOfficeAddress: '',
  defaultContactInfo: '',
  defaultSignatoryName: '',
  defaultSignatoryDesignation: '',
  defaultSignatoryOffice: '',
  defaultFontFamily: 'times',
  defaultFontSize: 12,
  defaultMargins: {
    top: 25,
    bottom: 25,
    left: 25,
    right: 20,
  },
};

/**
 * Creates a clean, blank official document without any invented or sample facts,
 * populating only the parameters explicitly saved in user settings.
 */
export function createBlankDocument(settings?: Partial<UserSettings>): LetterDocument {
  return {
    id: `doc-${Date.now()}`,
    title: 'Untitled Letter',
    documentType: 'official_letter',
    officeName: settings?.defaultOfficeName || '',
    department: settings?.defaultDepartment || '',
    officeAddress: settings?.defaultOfficeAddress || '',
    contactInfo: settings?.defaultContactInfo || '',
    memoNo: '',
    date: '',
    toPrefix: 'To',
    toName: '',
    toDesignation: '',
    toOffice: '',
    toAddress: '',
    subject: '',
    reference: '',
    salutation: 'Madam / Sir,',
    body: '',
    closing: 'Yours faithfully,',
    signatoryName: settings?.defaultSignatoryName || '',
    signatoryDesignation: settings?.defaultSignatoryDesignation || '',
    signatoryDesignationLine1: settings?.defaultSignatoryDesignation || '',
    signatoryDesignationLine2: '',
    signatoryDesignationLine3: '',
    signatoryDesignationLine4: '',
    signatoryOffice: settings?.defaultSignatoryOffice || '',
    enclosures: [],
    copyTo: [],
    formatting: {
      ...DEFAULT_FORMATTING,
      fontFamily: settings?.defaultFontFamily || DEFAULT_FORMATTING.fontFamily,
      fontSize: settings?.defaultFontSize || DEFAULT_FORMATTING.fontSize,
      margins: settings?.defaultMargins || DEFAULT_FORMATTING.margins,
    },
    letterheadConfig: DEFAULT_LETTERHEAD_CONFIG,
  };
}

export const INITIAL_DOCUMENT: LetterDocument = createBlankDocument(DEFAULT_USER_SETTINGS);

export const SAMPLE_LETTERHEADS: LetterheadAsset[] = [];
export const SAMPLE_SIGNATURES: SignatureAsset[] = [];

export const INITIAL_LETTERHEAD: LetterheadAsset | null = null;
export const INITIAL_SIGNATURE: SignatureAsset | null = null;
export const DEFAULT_SETTINGS = DEFAULT_USER_SETTINGS;
