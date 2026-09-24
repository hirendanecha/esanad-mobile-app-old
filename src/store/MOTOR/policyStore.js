import { create } from 'zustand';

export const usePolicyStore = create(set => ({
  extraFeatureInfo: null,
  comparePolicy: [],
  agentContact: null,

  updateExtraFeature: extraFeatureInfo => {
    set({ extraFeatureInfo });
  },
  updateComparePolicy: comparePolicy => {
    set({ comparePolicy });
  },
  updateAgentContact: agentContact => {
    set({ agentContact });
  },

  clearMotorStore: () =>
    set({
      extraFeatureInfo: null,
      comparePolicy: [],
      agentContact: null,
    }),
}));
