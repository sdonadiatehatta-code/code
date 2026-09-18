import { LetterDocument, DocumentType } from '../types';

export interface DocumentTemplate {
  id: string;
  name: string;
  documentType: DocumentType;
  description: string;
  defaultData: Partial<LetterDocument>;
}

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'official-letter-1',
    name: 'Official Letter (Standard)',
    documentType: 'official_letter',
    description: 'General administrative communication to subordinate or external authorities.',
    defaultData: {
      documentType: 'official_letter',
      title: 'Standard Official Letter',
      officeName: '',
      department: '',
      officeAddress: '',
      contactInfo: '',
      memoNo: '',
      date: '',
      toPrefix: 'To',
      toName: '',
      toDesignation: '[Recipient Designation]',
      toOffice: '[Office / Department]',
      toAddress: '[Office Address]',
      subject: '[Subject of the Official Letter]',
      reference: '',
      salutation: 'Madam / Sir,',
      body: `1. In inviting reference to the subject cited above, I am directed to state that [State the primary factual statement or premise].

2. [Detail the specific background, administrative observations, or regulatory provisions].

3. Under the circumstances, you are hereby requested to [State the specific action, report, or compliance required] within [Deadline / Timeframe] without fail.

4. This may kindly be treated as urgent.`,
      closing: 'Yours faithfully,',
      signatoryName: '',
      signatoryDesignation: '[Designation of Issuing Authority]',
      signatoryOffice: '',
      enclosures: [],
      copyTo: [
        '1. [Higher Authority], for kind information.',
        '2. Office Copy / Guard File.',
      ],
    },
  },
  {
    id: 'reminder-letter',
    name: 'Urgent Reminder Letter',
    documentType: 'reminder',
    description: 'Strict reminder for overdue reports, statutory information or pending files.',
    defaultData: {
      documentType: 'reminder',
      title: 'Urgent Reminder Letter',
      officeName: '',
      department: '',
      officeAddress: '',
      contactInfo: '',
      memoNo: '',
      date: '',
      toPrefix: 'To',
      toName: '',
      toDesignation: '[Recipient Designation]',
      toOffice: '[Office / Department]',
      toAddress: '[Address]',
      subject: 'REMINDER: Immediate submission of [Matter / Report / Pending Information].',
      reference: '1. This office Memo No. [Memo No.] dated [Date]',
      salutation: 'Madam / Sir,',
      body: `1. In inviting reference to the communication(s) cited above, I am directed to draw your urgent attention to the fact that the requisite [Report / Statement / Compliance] is still awaiting submission at this end.

2. In view of impending deadlines and administrative requirements, further delay in submitting the authenticated records cannot be accommodated.

3. You are therefore requested to submit the finalized [Document / Information] by [Deadline] positively, failing which the matter shall be brought to the notice of higher authorities for appropriate administrative action.`,
      closing: 'Yours faithfully,',
      signatoryName: '',
      signatoryDesignation: '[Designation of Issuing Authority]',
      signatoryOffice: '',
      enclosures: [],
      copyTo: [
        '1. [Superior Officer], for kind appraisal.',
        '2. Office Copy.',
      ],
    },
  },
  {
    id: 'notice',
    name: 'Official Notice',
    documentType: 'notice',
    description: 'Formal announcement, hearing notice or public communication.',
    defaultData: {
      documentType: 'notice',
      title: 'Official Notice',
      officeName: '',
      department: '',
      officeAddress: '',
      contactInfo: '',
      memoNo: '',
      date: '',
      toPrefix: '',
      toName: '',
      toDesignation: 'NOTICE',
      toOffice: '',
      toAddress: '',
      subject: 'NOTICE FOR [PURPOSE / HEARING / TENDER / AUCTION / INSPECTION]',
      reference: '',
      salutation: '',
      body: `1. It is hereby notified for the information of all concerned that [State the primary event, hearing, or administrative notice] will be held at [Venue / Location] on [Date] at [Time].

2. All interested parties and concerned officials are requested to be present along with relevant supporting documents and authenticated records.

3. In default of appearance on the stipulated date and time, proceedings may be conducted ex-parte in accordance with statutory provisions.`,
      closing: '',
      signatoryName: '',
      signatoryDesignation: '[Designation of Issuing Authority]',
      signatoryOffice: '',
      enclosures: [],
      copyTo: [
        '1. Notice Board of this office.',
        '2. [Concerned Branch / Office] for wide publicity.',
      ],
    },
  },
  {
    id: 'office-memorandum',
    name: 'Office Memorandum (O.M.)',
    documentType: 'office_memorandum',
    description: 'Policy guidance, procedural directions, and internal administrative rules.',
    defaultData: {
      documentType: 'office_memorandum',
      title: 'Office Memorandum',
      officeName: '',
      department: 'ADMINISTRATIVE BRANCH',
      officeAddress: '',
      contactInfo: '',
      memoNo: '',
      date: '',
      toPrefix: '',
      toName: '',
      toDesignation: 'MEMORANDUM',
      toOffice: '',
      toAddress: '',
      subject: '[Subject of Administrative Policy or Procedural Instruction]',
      reference: '',
      salutation: '',
      body: `1. It has come to notice that [Describe administrative issue, practice, or operational requirement].

2. All Section Heads and subordinate offices are hereby instructed to ensure strict adherence to [State the directive or procedure].

3. Non-compliance or unauthorized deviation from this instruction shall be viewed seriously and may invite administrative action under applicable service rules.

4. All staff members are enjoined to cooperate in maintaining administrative discipline.`,
      closing: '',
      signatoryName: '',
      signatoryDesignation: '[Designation of Issuing Authority]',
      signatoryOffice: '',
      enclosures: [],
      copyTo: [
        '1. All Section In-Charges for strict compliance.',
        '2. Office Order Book / Guard File.',
      ],
    },
  },
  {
    id: 'office-order',
    name: 'Office Order',
    documentType: 'office_order',
    description: 'Internal duty assignments, sanction orders, and administrative deployments.',
    defaultData: {
      documentType: 'office_order',
      title: 'Office Order',
      officeName: '',
      department: 'ORDER',
      officeAddress: '',
      contactInfo: '',
      memoNo: '',
      date: '',
      toPrefix: '',
      toName: '',
      toDesignation: 'OFFICE ORDER',
      toOffice: '',
      toAddress: '',
      subject: '[Subject / Deployment / Committee Constitution / Work Allocation]',
      reference: '',
      salutation: '',
      body: `1. In the interest of public service and administrative efficiency, [State the official assignment, transfer, charge handover, or sanction order] is hereby ordered with immediate effect until further orders:
   (i) [Officer / Staff Name & Designation] - [Assigned responsibility]
   (ii) [Officer / Staff Name & Designation] - [Assigned responsibility]

2. The officers/staff concerned shall assume their respective duties on [Date] positively and submit joining reports to the undersigned.

3. This order takes effect immediately.`,
      closing: '',
      signatoryName: '',
      signatoryDesignation: '[Designation of Issuing Authority]',
      signatoryOffice: '',
      enclosures: [],
      copyTo: [
        '1. Persons concerned for immediate compliance.',
        '2. Accounts & Establishment Branch.',
        '3. Guard File.',
      ],
    },
  },
  {
    id: 'direction-letter',
    name: 'Direction / Compliance Order',
    documentType: 'direction_letter',
    description: 'Mandatory directive issued under statutory powers requiring time-bound compliance.',
    defaultData: {
      documentType: 'direction_letter',
      title: 'Direction Order',
      officeName: '',
      department: '',
      officeAddress: '',
      contactInfo: '',
      memoNo: '',
      date: '',
      toPrefix: 'To',
      toName: '[Name of Recipient]',
      toDesignation: '[Designation / Agency / Individual]',
      toOffice: '[Office or Institution]',
      toAddress: '[Full Address]',
      subject: 'DIRECTION FOR [SPECIFY MANDATORY STATUTORY ACTION OR COMPLIANCE]',
      reference: '1. [Inspection Report or Official Complaint] dated [Date]',
      salutation: 'Madam / Sir,',
      body: `1. Whereas it has been brought to the notice of this office through [Report / Inspection / Complaint] that [Describe factual contravention, hazard, or unauthorized condition];

2. And whereas such condition requires immediate corrective intervention to preserve public order, safety, or statutory compliance;

3. Now, therefore, you are hereby directed to [State the precise mandatory action] within [Timeframe / Deadline] from the receipt of this order, failing which necessary administrative or legal action will be initiated in accordance with law.`,
      closing: 'Issued under my hand and seal,',
      signatoryName: '',
      signatoryDesignation: '[Designation of Issuing Authority]',
      signatoryOffice: '',
      enclosures: [],
      copyTo: [
        '1. [Enforcing Officer] for service and report on compliance.',
        '2. Office Copy.',
      ],
    },
  },
  {
    id: 'show-cause',
    name: 'Show Cause Notice',
    documentType: 'show_cause',
    description: 'Disciplinary or regulatory notice directing an explanation within specified days.',
    defaultData: {
      documentType: 'show_cause',
      title: 'Show Cause Notice',
      officeName: '',
      department: 'ESTABLISHMENT WING',
      officeAddress: '',
      contactInfo: '',
      memoNo: '',
      date: '',
      toPrefix: 'To',
      toName: '[Name of Employee / Licensee]',
      toDesignation: '[Designation / Trade]',
      toOffice: '[Office / Branch]',
      toAddress: '[Address]',
      subject: 'SHOW CAUSE NOTICE REGARDING [SPECIFIC INFRACTION / ABSENCE / IRREGULARITY]',
      reference: '',
      salutation: 'Madam / Sir,',
      body: `1. Whereas during [Inspection / Verification] conducted on [Date], it was found that [Describe specific irregularity, absence, or dereliction of duty];

2. And whereas the said action constitutes a breach of administrative discipline and applicable conduct rules;

3. You are therefore called upon to show cause in writing within [Number of Days] days from the date of receipt of this notice as to why appropriate disciplinary or regulatory action should not be initiated against you.

4. If no written explanation is received within the stipulated period, it will be presumed that you have no defense to offer and appropriate ex-parte decision will be taken.`,
      closing: '',
      signatoryName: '',
      signatoryDesignation: '[Designation of Issuing Authority]',
      signatoryOffice: '',
      enclosures: [],
      copyTo: [
        '1. Personal File of the incumbent.',
        '2. Guard File.',
      ],
    },
  },
  {
    id: 'forwarding-letter',
    name: 'Forwarding Letter',
    documentType: 'forwarding_letter',
    description: 'Forwarding petitions, inquiry reports, or audited claims to higher departments.',
    defaultData: {
      documentType: 'forwarding_letter',
      title: 'Forwarding Letter',
      officeName: '',
      department: '',
      officeAddress: '',
      contactInfo: '',
      memoNo: '',
      date: '',
      toPrefix: 'To',
      toName: '',
      toDesignation: '[Designation of Higher Authority]',
      toOffice: '[Department / Directorate]',
      toAddress: '[Office Address]',
      subject: 'Forwarding of [Report / Petition / Proposal / Claim] regarding [Subject Matter].',
      reference: '[Memo No. / Letter No.] dated [Date]',
      salutation: 'Madam / Sir,',
      body: `1. With reference to the communication cited above, I have the honour to forward herewith [Describe the document, e.g. inquiry report, authenticated proposal, or petition] along with supporting records and verification papers.

2. On scrutiny of the facts, the proposal/report is submitted for favour of your kind perusal and further necessary direction/sanction.`,
      closing: 'Yours faithfully,',
      signatoryName: '',
      signatoryDesignation: '[Designation of Issuing Authority]',
      signatoryOffice: '',
      enclosures: [
        '1. [Enclosure 1].',
        '2. [Enclosure 2].',
      ],
      copyTo: [
        '1. Office Copy.',
      ],
    },
  },
  {
    id: 'compliance-letter',
    name: 'Compliance / Action Taken Report',
    documentType: 'compliance_letter',
    description: 'Formal submission of compliance report against directives or public grievances.',
    defaultData: {
      documentType: 'compliance_letter',
      title: 'Action Taken Report / Compliance Letter',
      officeName: '',
      department: '',
      officeAddress: '',
      contactInfo: '',
      memoNo: '',
      date: '',
      toPrefix: 'To',
      toName: '',
      toDesignation: '[Designation of Authority]',
      toOffice: '[Office / Department]',
      toAddress: '[Address]',
      subject: 'Submission of Action Taken Report on [Directive / Grievance No. / Inspection Note].',
      reference: '[Order No. / Memo No.] dated [Date]',
      salutation: 'Madam / Sir,',
      body: `1. In inviting reference to the communication cited above regarding [Subject Matter], an inquiry/verification was conducted by this office.

2. It is submitted that the directed action has been executed in conformity with government guidelines as detailed below:
   (i) [Action item 1 completed]
   (ii) [Action item 2 completed]

3. The authenticated Action Taken Report along with supporting documentation is submitted herewith for favour of kind information and record.`,
      closing: 'Yours faithfully,',
      signatoryName: '',
      signatoryDesignation: '[Designation of Issuing Authority]',
      signatoryOffice: '',
      enclosures: [
        '1. Action Taken Report in prescribed format.',
        '2. Supporting inspection records/photographs.',
      ],
      copyTo: [
        '1. Office Copy.',
      ],
    },
  },
  {
    id: 'request-letter',
    name: 'Requisition / Request Letter',
    documentType: 'request_letter',
    description: 'Formal inter-office requisition for personnel, materials, logistics or security.',
    defaultData: {
      documentType: 'request_letter',
      title: 'Requisition / Request Letter',
      officeName: '',
      department: '',
      officeAddress: '',
      contactInfo: '',
      memoNo: '',
      date: '',
      toPrefix: 'To',
      toName: '',
      toDesignation: '[Designation of Requested Officer]',
      toOffice: '[Department / Agency]',
      toAddress: '[Address]',
      subject: 'Requisition for [Personnel / Equipment / Facilities / Logistics] for [Event / Duty].',
      reference: '',
      salutation: 'Madam / Sir,',
      body: `1. I am directed to state that [State the administrative purpose, program, or duty] is scheduled to take place at [Location] on [Date].

2. In order to ensure smooth conduct of the official duties, you are kindly requested to provide/deploy [State the exact requisition needed, e.g. personnel, vehicles, inspection team] on the aforementioned date.

3. A coordinating officer may kindly be designated to liaise with this office in this regard.`,
      closing: 'Yours faithfully,',
      signatoryName: '',
      signatoryDesignation: '[Designation of Issuing Authority]',
      signatoryOffice: '',
      enclosures: [],
      copyTo: [
        '1. [Supervising Authority] for kind information.',
        '2. Guard File.',
      ],
    },
  },
];
