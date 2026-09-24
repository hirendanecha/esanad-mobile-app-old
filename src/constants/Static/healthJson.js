const INSURANCE_FOR = [
  { label: 'Self', value: 'Self' },
  { label: 'Self (Investor)', value: 'Self (Investor)' },
  { label: 'Self and Dependent', value: 'Self and Dependent' },
  {
    label: 'Self (Investor) and Dependent',
    value: 'Self (Investor) and Dependent',
  },
  { label: 'Dependent only', value: 'Dependent only' },
  { label: 'Investor’s Dependent only', value: 'Investor’s Dependent only' },
];

const COUNTRIES = [
  { label: 'India', value: 'India' },
  { label: 'Pakistan', value: 'Pakistan' },
  { label: 'Phillipines', value: 'Phillipines' },
  { label: 'UAE', value: 'UAE' },
  { label: 'Egypt', value: 'Egypt' },
  { label: 'Jordan', value: 'Jordan' },
  { label: 'Africa', value: 'Africa' },
  { label: 'Australia', value: 'Australia' },
];

const CITY = [
  { label: 'Abu Dhabi', value: 'Abu Dhabi' },
  { label: 'Ajman', value: 'Ajman' },
  { label: 'Dubai', value: 'Dubai' },
  { label: 'Fujairah', value: 'Fujairah' },
  { label: 'Ras Al Khaimah', value: 'Ras Al Khaimah' },
  { label: 'Sharjah', value: 'Sharjah' },
  { label: 'Umm Al Quwain', value: 'Umm Al Quwain' },
];

const SALARY = [
  { label: 'Up to 4000', value: 'Up to 4000' },
  { label: '4000 - 12000', value: '4000 - 12000' },
  { label: '12000+', value: '12000+' },
];

const GENDER = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
];

const MARITAL_STATUS = [
  { label: 'Single', value: 'Single' },
  { label: 'Married', value: 'Married' },
  { label: 'Divorced', value: 'Divorced' },
  { label: 'Widow', value: 'Widow' },
];

const VISA_STATUS = [
  { label: 'Renewal', value: 'Renewal' },
  { label: 'Change status', value: 'Change status' },
  { label: 'New', value: 'New' },
];

const CURRENT_INSURANCE = [
  { label: 'Al Ittihad Al Watani', value: 'Al Ittihad Al Watani' },
  { label: 'AXA / GIG', value: 'AXA / GIG' },
  { label: 'Al Sagr Insurance Company', value: 'Al Sagr Insurance Company' },
  { label: 'Arabia Insurance Company', value: 'Arabia Insurance Company' },
  {
    label: 'Al Buhaira National Insurance Company',
    value: 'Al Buhaira National Insurance Company',
  },
  {
    label: 'Al Dhafra Insurance Company',
    value: 'Al Dhafra Insurance Company',
  },
  { label: 'Abu Dhabi National Takaful', value: 'Abu Dhabi National Takaful' },
  { label: 'Alliance', value: 'Alliance' },
  { label: 'Adamjee', value: 'Adamjee' },
  { label: 'Bupa', value: 'Bupa' },
  { label: 'Cigna', value: 'Cigna' },
  { label: 'Daman', value: 'Daman' },
  { label: 'Dubai Insurance Company', value: 'Dubai Insurance Company' },
  {
    label: 'Dubai National Insurance Company',
    value: 'Dubai National Insurance Company',
  },
  { label: 'Emirates Insurance Company', value: 'Emirates Insurance Company' },
  { label: 'Fidelity United', value: 'Fidelity United' },
  { label: 'Insurance House', value: 'Insurance House' },
  { label: 'MedGulf', value: 'MedGulf' },
  { label: 'MaxHealth', value: 'MaxHealth' },
  { label: 'Methaq', value: 'Methaq' },
  { label: 'NLGI', value: 'NLGI' },
  { label: 'Noor Takaful', value: 'Noor Takaful' },
  { label: 'National General Insurance', value: 'National General Insurance' },
  { label: 'Orient Insurance Company', value: 'Orient Insurance Company' },
  {
    label: 'Orient Takaful Insurance Company',
    value: 'Orient Takaful Insurance Company',
  },
  { label: 'Oman / Sukoon', value: 'Oman / Sukoon' },
  { label: 'Qatar Insurance Company', value: 'Qatar Insurance Company' },
  { label: 'RAK Insurance', value: 'RAK Insurance' },
  { label: 'Salama Insurance Company', value: 'Salama Insurance Company' },
  { label: 'SAICOHEALTH Damana', value: 'SAICOHEALTH Damana' },
  { label: 'Takaful Emarat', value: 'Takaful Emarat' },
  { label: 'Union Insurance', value: 'Union Insurance' },
  { label: 'Watania', value: 'Watania' },
  { label: 'Yas Takaful', value: 'Yas Takaful' },
  { label: 'others', value: 'others' },
];

const VISA_TYPE = [
  { label: 'Tourist/visit visa', value: 'Tourist/visit visa' },
  { label: 'Cancelled Visa', value: 'Cancelled Visa' },
];

const DOCS_UPLOADED_DATA = {
  Self: {
    Renewal: [
      { label: 'Passport', key: 'passport', require: true },
      { label: 'Visa', key: 'visaDoc', require: true },
      { label: 'Emirate Id', key: 'emiratesId', require: true },
      {
        label: 'Certificate Of Continuity',
        key: 'continuityCertificate',
        require: true,
      },
    ],
    ['Tourist/visit visa']: [
      { label: 'Passport', key: 'passport', require: true },
      {
        label: 'Visa with change status stamp',
        key: 'visaWithChangeStatusStamp',
        require: true,
      },
      { label: 'Tourist visa/Visit visa', key: 'touristVisa', require: true },
    ],
    ['Cancelled Visa']: [
      { label: 'Passport', key: 'passport', require: true },
      { label: 'Visa', key: 'visaDoc', require: true },
      { label: 'Emirate Id', key: 'emiratesId', require: true },
      {
        label: 'Cancellation of Visa',
        key: 'cancellationOfVisa',
        require: true,
      },
      { label: 'Change Status', key: 'changeStatus', require: true },
    ],
    New: [
      { label: 'Passport', key: 'passport', require: true },
      { label: 'Entry Stamp', key: 'entryStamp', require: true },
      { label: 'Change Status', key: 'changeStatus', require: true },
    ],
  },
  [`Self (Investor)`]: {
    Renewal: [
      { label: 'Passport', key: 'passport', require: true },
      { label: 'Visa', key: 'visaDoc', require: true },
      { label: 'Emirate Id', key: 'emiratesId', require: true },
      {
        label: 'Certificate Of Continuity',
        key: 'continuityCertificate',
        require: true,
      },
      { label: 'Trade license', key: 'tradeLicense', require: true },
    ],
    ['Tourist/visit visa']: [
      { label: 'Passport', key: 'passport', require: true },
      {
        label: 'Visa with change status stamp',
        key: 'visaWithChangeStatusStamp',
        require: true,
      },
      { label: 'Tourist visa/Visit visa', key: 'touristVisa', require: true },
      { label: 'Trade license', key: 'tradeLicense', require: true },
    ],
    ['Cancelled Visa']: [
      { label: 'Passport', key: 'passport', require: true },
      { label: 'Visa', key: 'visaDoc', require: true },
      { label: 'Emirate Id', key: 'emiratesId', require: true },
      {
        label: 'Cancellation of Visa',
        key: 'cancellationOfVisa',
        require: true,
      },
      { label: 'Change Status', key: 'changeStatus', require: true },
      { label: 'Trade license', key: 'tradeLicense', require: true },
    ],
    New: [
      { label: 'Passport', key: 'passport', require: true },
      { label: 'Entry Stamp', key: 'entryStamp', require: true },
      { label: 'Change Status', key: 'changeStatus', require: true },
      { label: 'Trade license', key: 'tradeLicense', require: true },
    ],
  },
  [`Dependent only`]: {
    Renewal: [
      { label: 'Passport', key: 'passport', require: true },
      { label: 'Visa', key: 'visaDoc', require: true },
      { label: 'Emirate Id', key: 'emiratesId', require: true },
      {
        label: 'Certificate Of Continuity',
        key: 'continuityCertificate',
        require: true,
        ownerRequire: true,
        requireCity: ['Abu Dhabi'],
      },
    ],
    ['Tourist/visit visa']: [
      { label: 'Passport', key: 'passport', require: true },
      {
        label: 'Visa with change status stamp',
        key: 'visaWithChangeStatusStamp',
        require: true,
      },
      { label: 'Tourist visa/Visit visa', key: 'touristVisa', require: true },
    ],
    ['Cancelled Visa']: [
      { label: 'Passport', key: 'passport', require: true },
      { label: 'Visa', key: 'visaDoc', require: true },
      { label: 'Emirate Id', key: 'emiratesId', require: true },
    ],
    New: [
      { label: 'Passport', key: 'passport', require: true },
      { label: 'Visa', key: 'visaDoc', require: false, ownerRequire: true },
      {
        label: 'Emirate Id',
        key: 'emiratesId',
        require: false,
        ownerRequire: true,
      },
    ],
  },
  [`Investor's Dependent only`]: {
    Renewal: [
      { label: 'Passport', key: 'passport', require: true },
      { label: 'Visa', key: 'visaDoc', require: true },
      { label: 'Emirate Id', key: 'emiratesId', require: true },
      {
        label: 'Certificate Of Continuity',
        key: 'continuityCertificate',
        require: false,
        ownerRequire: true,
        requireCity: ['Abu Dhabi'],
      },
      {
        label: ' Trade license',
        key: 'tradeLicense',
        require: false,
        ownerRequire: true,
        onlyOwner: ['ownerDetails'],
      },
    ],
    ['Tourist/visit visa']: [
      { label: 'Passport', key: 'passport', require: true },
      {
        label: 'Visa with change status stamp',
        key: 'visaWithChangeStatusStamp',
        require: true,
      },
      { label: 'Tourist visa/Visit visa', key: 'touristVisa', require: true },
      {
        label: ' Trade license',
        key: 'tradeLicense',
        require: false,
        ownerRequire: true,
        onlyOwner: ['ownerDetails'],
      },
    ],
    ['Cancelled Visa']: [
      { label: 'Passport', key: 'passport', require: true },
      { label: 'Visa', key: 'visaDoc', require: true },
      { label: 'Emirate Id', key: 'emiratesId', require: true },
      {
        label: ' Trade license',
        key: 'tradeLicense',
        require: false,
        ownerRequire: true,
        onlyOwner: ['ownerDetails'],
      },
    ],
    New: [
      { label: 'Passport', key: 'passport', require: true },
      { label: 'Visa', key: 'visaDoc', require: false, ownerRequire: true },
      {
        label: 'Emirate Id',
        key: 'emiratesId',
        require: false,
        ownerRequire: true,
      },
      {
        label: ' Trade license',
        key: 'tradeLicense',
        require: false,
        ownerRequire: true,
        onlyOwner: ['ownerDetails'],
      },
    ],
  },
  [`Self and Dependent`]: {
    Renewal: [
      { label: 'Passport', key: 'passport', require: true },
      { label: 'Visa', key: 'visaDoc', require: true },
      { label: 'Emirate Id', key: 'emiratesId', require: true },
      {
        label: 'Certificate Of Continuity',
        key: 'continuityCertificate',
        require: true,
        ownerRequire: true,
        requireCity: ['Abu Dhabi'],
      },
    ],
    ['Tourist/visit visa']: [
      { label: 'Passport', key: 'passport', require: true },
      {
        label: 'Visa with change status stamp',
        key: 'visaWithChangeStatusStamp',
        require: true,
      },
      { label: 'Tourist visa/Visit visa', key: 'touristVisa', require: true },
    ],
    ['Cancelled Visa']: [
      { label: 'Passport', key: 'passport', require: true },
      { label: 'Visa', key: 'visaDoc', require: true },
      { label: 'Emirate Id', key: 'emiratesId', require: true },
    ],
    New: [
      { label: 'Passport', key: 'passport', require: true, ownerRequire: true },
      { label: 'Visa', key: 'visaDoc', require: false, ownerRequire: true },
      {
        label: 'Emirate Id',
        key: 'emiratesId',
        require: false,
        ownerRequire: true,
      },
    ],
  },
  [`Self (Investor) and Dependent`]: {
    Renewal: [
      { label: 'Passport', key: 'passport', require: true },
      { label: 'Visa', key: 'visaDoc', require: true },
      { label: 'Emirate Id', key: 'emiratesId', require: true },
      {
        label: 'Certificate Of Continuity',
        key: 'continuityCertificate',
        require: true,
        ownerRequire: true,
        requireCity: ['Abu Dhabi'],
      },
      {
        label: ' Trade license',
        key: 'tradeLicense',
        require: false,
        ownerRequire: true,
        onlyOwner: ['ownerDetails'],
      },
    ],
    ['Tourist/visit visa']: [
      { label: 'Passport', key: 'passport', require: true },
      {
        label: 'Visa with change status stamp',
        key: 'visaWithChangeStatusStamp',
        require: true,
      },
      { label: 'Tourist visa/Visit visa', key: 'touristVisa', require: true },
      {
        label: ' Trade license',
        key: 'tradeLicense',
        require: false,
        ownerRequire: true,
        onlyOwner: ['ownerDetails'],
      },
    ],
    ['Cancelled Visa']: [
      { label: 'Passport', key: 'passport', require: true },
      { label: 'Visa', key: 'visaDoc', require: true },
      { label: 'Emirate Id', key: 'emiratesId', require: true },
      {
        label: ' Trade license',
        key: 'tradeLicense',
        require: false,
        ownerRequire: true,
        onlyOwner: ['ownerDetails'],
      },
    ],
    New: [
      { label: 'Passport', key: 'passport', require: true, ownerRequire: true },
      { label: 'Visa', key: 'visaDoc', require: false, ownerRequire: true },
      {
        label: 'Emirate Id',
        key: 'emiratesId',
        require: false,
        ownerRequire: true,
      },
      {
        label: ' Trade license',
        key: 'tradeLicense',
        require: false,
        ownerRequire: true,
        onlyOwner: ['ownerDetails'],
      },
    ],
  },
};

const GENDER_OPTIONS = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
];

const MARITAL_STATUS_OPTIONS = [
  { label: 'Single', value: 'Single' },
  { label: 'Married', value: 'Married' },
  { label: 'Divorced', value: 'Divorced' },
  { label: 'Widowed', value: 'Widowed' },
];

const COUNTRIES_OPTIONS = [
  { label: 'Pakistan', value: 'Pakistan' },
  { label: 'UAE', value: 'UAE' },
  { label: 'Other', value: 'Other' },
];

const SALARY_BAND_OPTIONS = [
  { label: 'AED 4000 and below', value: '4000' },
  { label: 'AED 4001 and above', value: '4001' },
];

const VISA_TYPE_OPTIONS = [
  { label: 'Dubai', value: 'Dubai' },
  { label: 'Abu Dhabi', value: 'AbuDhabi' },
  { label: 'Other', value: 'Other' },
];

const CONTENT = [
  'I hereby declare that what has been stated above is true and complete to the best of my knowledge and belief and I have not withheld any material information. It is understood and agreed that this declaration which is contained in the application form constitutes the basis of my/our contractual relationship with Insurance Co through Authorized Third-Party Administrator and that any non- disclosure or misrepresentation of facts will make my / our insurance coverage void from inception. I hereby authorize any hospital, physician, surgeon, or any other organization to furnish to the Insurance Co through Authorized Third-Party Administrator any or all information that may be required concerning my/ our medical history.',
  "I understand and acknowledge any pregnancy not declared at the time of this application's coverage will be at the sole discretion of the insurer. The insurer has the right to not cover any maternity claims to any undeclared pregnancy. I also acknowledge and understand any pregnancy, which arises within forty calendar days from the date of this application; coverage will also be at the discretion of the insurer.",
  'Furthermore, I also understand and acknowledge that any ongoing or planned hospitalization not declared at the time of this applications coverage will be at the sole discretion of the insurer and the Insurer has the right not to cover.',
  'I hereby provide Takaful Emarat Insurance PSC an unambiguous consent, to contact us for our takaful policy or for any marketing and promotion of takaful products, to process, share, and transfer the personal information of the members insured to any recipient whether inside or outside the country, including but not limited to the Company branches, affiliates, reinsurers, business partners, professional advisers, insurance brokers and/or service providers where the transfer or share, of such personal data is necessary for: i the performance of this Policy; ii - assisting the Company in the development of its business and products; iii- improving the Companys customers experience; iv for the compliance with the applicable laws and regulations.',
  'Personal Data means all information relating to the member insured whether marked "personal" or not disclosed to Takaful Emarat Insurance PSC by whatever means either directly or indirectly which concerns, including but not limited to, my medical conditions, treatments, prescriptions, business, operations, contact details, account balances/activities or any transactions undertaken with Takaful Emarat Insurance PSC.',
];

const EMIRATES_OPTIONS = [
  { label: 'Dubai', value: 'Dubai' },
  { label: 'Abu Dhabi', value: 'Abu Dhabi' },
  { label: 'Sharjah', value: 'Sharjah' },
  { label: 'Ajman', value: 'Ajman' },
  { label: 'Ras Al Khaimah', value: 'Ras Al Khaimah' },
  { label: 'Fujairah', value: 'Fujairah' },
  { label: 'Umm Al Quwain', value: 'Umm Al Quwain' },
];

const YES_NO_OPTIONS = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
];

const MEDICAL_CONDITIONS_TABLE_1 = [
  'Are you under any medical observation/undergoing any medical/ surgical/ treatment or have been advised for the same?',
  'Do you have any chronic illness? A chronic condition is defined as a disease, illness, or injury that has one or more of the following characteristics: It needs ongoing or long-term monitoring through consultations, examinations, check-ups, and /or tests. It needs ongoing or long-term control or relief of symptoms. It may require rehabilitation or the patient to be trained to cope with it. It continues indefinitely. Symptoms / medical condition may recur or likely to recur.',
  'Are you taking any medication (pharmaceutical/alternative medicine) or have been advised?',
  'Do you have any physical problems/ disability for which you are undergoing physiotherapy or have been advised for?',
  'Have you been admitted in the hospital in the last 10 years?',
  'Are you currently pregnant or show signs and symptoms of pregnancy or planning to get pregnant? (This question apply only to married females',
  'Do you have any previous surgical history or are you advised to undergo any kind of surgeries in the near future?',
  'Have you been ever diagnosed/treated and cured or undergoing treatments for cancer?',
  'Is there any other medical condition or disorder or any symptoms that you should be declared, and you are unable to relate to the above-mentioned Questions?',
];

const MEDICAL_CONDITIONS_TABLE_2 = [
  'Any Heart Disease or hypertension',
  'Autoimmune Diseases',
  'Diabetes/gestational diabetes',
  'Thyroid Diseases',
  'Kidney Diseases',
  'Any placenta problems with the current pregnancy',
  'Any episode of vaginal bleeding with this pregnancy',
];

const RELATIONS_OPTIONS = [
  { label: 'Self', value: 'Self' },
  { label: 'Spouse', value: 'Spouse' },
  { label: 'Child', value: 'Child' },
  { label: 'Parent', value: 'Parent' },
];

const MEDICAL_QUESTIONS_TABLE_1 = [
  'Is there any eligible family member kept away from this insurance request?',
  'Do you currently have or Have you a valid insurance policy earlier?',
  'Has your health insurance request ever declined or accepted on substandard terms?',
  'Are you under any medical observation/undergoing any medical surgical treatment or have been advised for the same?',
  'Do you have any chronic illness? A chronic condition is defined as a disease, illness, or injury that has one or more of the following characteristics: It needs ongoing or long-term monitoring through consultations, examinations, check-ups, and /or tests. It needs ongoing or long-term control or relief of symptoms. It may require rehabilitation or the patient to be trained to cope with it. It continues indefinitely. Symptoms / medical condition may recur or likely to recur',
  'Are you taking any medication (pharmaceutical/alternative medicine) or have been advised?',
  'Do you have any physical problems/ disability for which you are undergoing physiotherapy or have been advised for?',
  'Have you been admitted in the hospital in the last 10 years?',
  'This question applies only to married females. Are you currently pregnant - show signs and/or symptoms of pregnancy - planning to get pregnant? Please fill the attached supplementary maternity questionnaire Page 5',
  'Do you have any previous surgical history or are you advised to undergo any kind of surgeries in the near future?',
  'Have you been ever diagnosed/treated and cured or undergoing treatments for cancer?',
  'Is there any other medical condition or disorder or any symptoms that you should declare, and you are unable to relate to the above-mentioned Questions?',
];

const MEDICAL_QUESTIONS_TABLE_2 = [
  'Any Heart Disease or hypertension',
  'Autoimmune Diseases',
  'Diabetes/gestational diabetes',
  'Thyroid Diseases',
  'Kidney Diseases',
  'Any placenta problems with the current pregnancy',
  'Any episode of vaginal bleeding with this pregnancy',
];

export const HEALTH_CONSTANTS = {
  INSURANCE_FOR,
  COUNTRIES,
  CITY,
  SALARY,
  GENDER,
  MARITAL_STATUS,
  VISA_STATUS,
  CURRENT_INSURANCE,
  VISA_TYPE,
  DOCS_UPLOADED_DATA,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  COUNTRIES_OPTIONS,
  SALARY_BAND_OPTIONS,
  VISA_TYPE_OPTIONS,
  CONTENT,
  EMIRATES_OPTIONS,
  YES_NO_OPTIONS,
  MEDICAL_CONDITIONS_TABLE_1,
  MEDICAL_CONDITIONS_TABLE_2,
  RELATIONS_OPTIONS,
  MEDICAL_QUESTIONS_TABLE_1,
  MEDICAL_QUESTIONS_TABLE_2,
};
