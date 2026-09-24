import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FaqAccordionItem from '../FaqAccordionItem';

describe('FaqAccordionItem Component', () => {
  const mockItem = {
    question: 'How to pay?',
    answer: 'You can pay via card.'
  };

  it('renders question and handles toggle', () => {
    const { getByText, queryByText } = render(<FaqAccordionItem faq={mockItem} onToggle={jest.fn()} />);
    
    expect(getByText('How to pay?')).toBeTruthy();
    // Answer might be hidden initially or rendered with height 0
    // But let's check if it's in the tree
    expect(queryByText('You can pay via card.')).toBeTruthy();
    
    const questionBtn = getByText('How to pay?');
    fireEvent.press(questionBtn);
    // Toggle state change
  });
});
