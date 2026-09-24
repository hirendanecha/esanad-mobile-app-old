// Radio options
const RENEWING_OPTIONS = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
];
const NEW_CAR_OPTIONS = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
];

const CLAIM_OPTIONS = {
  CLAIMED_LAST_YEAR: 'Claimed last year',
  NO_CLAIMS_FOR_1_YEARS: 'No Claims for 1 Years',
  NO_CLAIMS_FOR_2_YEARS: 'No Claims for 2 Years',
  NO_CLAIMS_FOR_3_YEARS: 'No Claims for 3 Years',
  NO_CLAIMS_FOR_4_YEARS: 'No Claims for 4 Years',
  NEVER_CLAIMED: 'Never Claimed',
};

const SORT_OPTION = [
  { lable: 'Price low to high', value: 'Price low to high' },
  { lable: 'Price high to low', value: 'Price high to low' },
];

const NEW_OR_RENEWAL = [
  { label: 'Brand New', value: 'Brand New' },
  { label: 'Renewal', value: 'Renewal' },
  { label: 'Pre-Owned', value: 'Pre-Owned' },
];

const BRAND_NEW_LIST = [
  'Bank LPO',
  'Driving License',
  'Emirates ID',
  'Quotation of the Car',
  'Vehicle Clearance Certificate',
];

const RENEWAL_LIST = [
  'Car Registration Card',
  'If Previous Insurance is Expired - Passing & Pictures of the car from all 4 side',
  'Driving License',
  'Emirates ID',
];

const PRE_OWNED_LIST = [
  'Bank LPO/Credit Approval from the Bank (If Purchasing Car on Bank Loan)',
  'Current dated Car Pictures',
  'Driving License',
  'Emirates ID (If Expired - Emirates Id Renewal Application/Valid Visa)',
  'No Objection Certificate for the Driver (If the Car is Registered Under Company Name)',
  'Passing Certificate',
  'Transfer Certificate/Hayaza/Possession Certificate/Previous Owner Mulkiya',
];

const SOURCE_OF_FUNDS = [
  {
    label: 'Ownership of a business/self-employed',
    value: 'Ownership of a business/self-employed',
  },
  { label: 'Employment/Salaried', value: 'Employment/Salaried' },
  { label: 'Inheritance', value: 'Inheritance' },
  { label: 'Investment', value: 'Investment' },
];

export const CONSTANTS = {
  RENEWING_OPTIONS,
  NEW_CAR_OPTIONS,
  CLAIM_OPTIONS,
  SORT_OPTION,
  NEW_OR_RENEWAL,
  BRAND_NEW_LIST,
  RENEWAL_LIST,
  PRE_OWNED_LIST,
  SOURCE_OF_FUNDS,
};
