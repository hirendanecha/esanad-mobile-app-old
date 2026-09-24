import { CONSTANTS } from '@constants/staticJson';
import { create } from 'zustand';

const initialState = {
  step: 0,
  subStep: 1,
  insuranceFor: null,
  city: null,
  salary: null,
  gender: null,
  maritalStatus: null,
  manualUser: null,
  requestId: null,
  internalRef: null,
  healthQuotesList: [],
  compareHealthPolicy: [],
  hasKids: false,
  kidsDetails: [],
  hasSpouse: false,
  spouseDetails: [],
  hasCousins: false,
  cousinsDetails: [],
  regeneratedata: {},
};

export const useHealthStore = create((set, get) => ({
  ...initialState,

  updateStep: step => set({ step }),
  updateSubStep: subStep => set({ subStep }),
  updateInsuranceFor: insuranceFor => set({ insuranceFor }),
  updateCity: city => set({ city }),
  updateSalary: salary => set({ salary }),
  updateGender: gender => set({ gender }),
  updateMaritalStatus: maritalStatus => set({ maritalStatus }),
  updateManualUser: manualUser => set({ manualUser }),
  updateRequestId: requestId => set({ requestId }),
  updateInternalRef: internalRef => set({ internalRef }),
  updateCompareHealthPolicy: compareHealthPolicy =>
    set({ compareHealthPolicy }),
  updateKidsDetails: (kidsDetails, hasKids = true) =>
    set({ kidsDetails, hasKids }),
  updateSpouseDetails: (spouseDetails, hasSpouse = true) =>
    set({ spouseDetails, hasSpouse }),
  updateCousinsDetails: (cousinsDetails, hasCousins = true) =>
    set({ cousinsDetails, hasCousins }),
  updateHasKids: hasKids => set({ hasKids }),
  updateHasSpouse: hasSpouse => set({ hasSpouse }),
  updateHasCousins: hasCousins => set({ hasCousins }),
  updateHealthQuotesList: healthQuotesList => {
    set({ healthQuotesList });
  },
  updateRegenerateData: regeneratedata => {
    set({ regeneratedata });
  },
}));
