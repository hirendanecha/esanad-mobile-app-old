import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomTable from '../CustomTable';

jest.mock('@theme/ThemeProvider', () => ({
  useThemeContext: () => ({
    theme: {
      colors: {
        backgroundColor: 'white',
        text: 'black',
        border: 'grey',
        primary: 'blue',
        bgSecondary: '#f0f0f0',
        textSecondary: 'white',
        floorBgColor: '#e0e0e0',
      },
    },
  }),
}));

const mockData = {
  data: [
    {
      _id: '1',
      QuatationCompanyName: 'Company A',
      insuranceType: 'comprehensive',
      company: { logoImg: { path: '/logo.png' } },
      quoteInfo: { totalPrice: 1000, sumInsured: 50000 },
    },
    {
      _id: '2',
      QuatationCompanyName: 'Company B',
      insuranceType: 'thirdparty',
      company: { logoImg: { path: '/logo2.png' } },
      quoteInfo: { totalPrice: 500, sumInsured: 0 },
    }
  ],
  coverages: [
    { Title: 'Accident', values: [true, false] }
  ],
  benefits: [
    { Title: 'Roadside', values: [true, true] }
  ]
};

describe('CustomTable Component', () => {
  it('renders headers and company names', () => {
    const { getByText } = render(
      <CustomTable 
        compareCompaniesData={mockData} 
        formatNumber={n => n.toString()}
      />
    );
    
    expect(getByText('Company A')).toBeTruthy();
    expect(getByText('Company B')).toBeTruthy();
    expect(getByText('Compare and Save Big!')).toBeTruthy();
  });

  it('calls onBuyNowPress when Buy Now is pressed', () => {
    const onBuyNowPress = jest.fn();
    const { getAllByText } = render(
      <CustomTable 
        compareCompaniesData={mockData} 
        onBuyNowPress={onBuyNowPress}
        formatNumber={n => n.toString()}
      />
    );
    
    const buyBtns = getAllByText('Buy Now');
    fireEvent.press(buyBtns[0]);
    expect(onBuyNowPress).toHaveBeenCalledWith('1');
  });
});
