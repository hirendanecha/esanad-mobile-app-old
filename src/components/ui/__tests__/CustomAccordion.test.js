import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { CustomAccordion } from '../CustomAccordion';

describe('CustomAccordion Component', () => {
  it('renders title and handles toggle', () => {
    const { getByText, getAllByText } = render(
      <CustomAccordion title="Accordion Title">
        <Text>Accordion Content</Text>
      </CustomAccordion>
    );

    expect(getAllByText('Accordion Content')).toHaveLength(1);

    const titleBtn = getByText('Accordion Title');
    fireEvent.press(titleBtn);
    
    expect(getAllByText('Accordion Content')).toHaveLength(2);
  });
});
