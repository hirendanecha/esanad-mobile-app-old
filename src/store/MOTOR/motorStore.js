import { CONSTANTS } from '@constants/staticJson';
import { create } from 'zustand';

// Define initial state separately
const initialState = {
  year: null,
  brand: null,
  model: null,
  trim: null,
  step: 0,
  subStep: 1,
  regionalSpace: 'GCC',
  isRenewing: true,
  isNewCar: true,
  registeredYear: null,
  compareRefID: null,
};

export const useMotorStore = create((set, get) => ({
  ...initialState,

  updateYear: year => {
    set({ year });
  },
  updateBrand: brand => {
    set({ brand });
  },
  updateModel: model => {
    set({ model });
  },
  updateTrim: trim => {
    set({ trim });
  },
  updateRegionalSpace: regionalSpace => {
    set({ regionalSpace });
  },
  updateIsRenewing: isRenewing => {
    set({ isRenewing });
  },
  updateIsNewCar: isNewCar => {
    set({ isNewCar });
  },
  updateRegisteredYear: registeredYear => {
    set({ registeredYear });
  },
  updateStep: step => set({ step }),
  updateSubStep: subStep => set({ subStep }),

  // Fixed: Use initialState instead of manually listing all fields
  clearMotorStore: () => set(initialState),

  resetFlow: async () => {
    return new Promise((resolve, reject) => {
      try {
        set({
          year: null,
          brand: null,
          model: null,
          trim: null,
          step: 0,
          subStep: 1,
        });
        resolve(get()); // return updated state
      } catch (err) {
        reject(err);
      }
    });
  },
}));

export const useMotorDetalisStore = create(set => ({
  carDeatils: {},
  createCarManual: {},
  calculateCarValue: {},
  policyDetails: new Date(),
  isComprehensiveInsurance: true,
  isActiveInsurance: true,
  clamDetails: CONSTANTS.CLAIM_OPTIONS.NEVER_CLAIMED,
  manulUesrDetails: {},
  requestId: null,
  quotesList: [],
  listQuotes: {},
  filterData: null,

  updateCarDeatils: carDeatils => {
    set({ carDeatils });
  },
  updateCreateCarManual: createCarManual => {
    set({ createCarManual });
  },
  updateCalculateCarValue: calculateCarValue => {
    set({ calculateCarValue });
  },
  updatePolicyDetails: policyDetails => {
    set({ policyDetails });
  },
  updateIsComprehensiveInsurance: isComprehensiveInsurance => {
    set({ isComprehensiveInsurance });
  },
  updateIsActiveInsurance: isActiveInsurance => {
    set({ isActiveInsurance });
  },
  updateClamDetails: clamDetails => {
    set({ clamDetails });
  },
  updateManulUesrDetails: manulUesrDetails => {
    set({ manulUesrDetails });
  },
  updateRequestId: requestId => {
    set({ requestId });
  },
  updateQuotesList: quote => {
    set({
      quotesList: quote,
    });
  },
  updateListQuotes: listQuotes => {
    set({ listQuotes });
  },
  updateFilterData: filterData => {
    set({ filterData });
  },
  updateComparePolicy: comparePolicy => {
    set({ comparePolicy });
  },

  updateCompareRefID: compareRefID => {
    set({ compareRefID });
  },

  clearMotorDetalisStore: () =>
    set({
      carDeatils: {},
      createCarManual: {},
      calculateCarValue: {},
      clamDetails: CONSTANTS.CLAIM_OPTIONS.NEVER_CLAIMED,
      policyDetails: new Date(),
      isComprehensiveInsurance: true,
      isActiveInsurance: true,
      manulUesrDetails: {},
      requestId: null,
      quotesList: [],
      listQuotes: {},
      filterData: [],
      compareRefID: null,
    }),
}));
