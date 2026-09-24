import React, { createContext, useContext, useState, useCallback } from 'react';
import LottieLoader from '@components/ui/LottieLoader';

const LottieLoaderContext = createContext({
  showLoader: () => {},
  hideLoader: () => {},
});

export const useLottieLoader = () => useContext(LottieLoaderContext);

export const LottieLoaderProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState('motor');
  const showLoader = value => {
    setVisible(true);
    setType(value);
  };
  const hideLoader = () => {
    setVisible(false);
    setType('motor');
  };

  return (
    <LottieLoaderContext.Provider value={{ showLoader, hideLoader, visible }}>
      {children}
      <LottieLoader manualVisible={visible} type={type} />
    </LottieLoaderContext.Provider>
  );
};
