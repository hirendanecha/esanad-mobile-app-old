import { ageCalculator } from '../ageCalculator';

describe('ageCalculator', () => {
  it('returns empty string if no date is provided', () => {
    expect(ageCalculator()).toBe('');
    expect(ageCalculator(null)).toBe('');
  });

  it('calculates the correct age based on today', () => {
    const today = new Date();
    // Someone born exactly 20 years ago today
    const birthDate20YearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
    expect(ageCalculator(birthDate20YearsAgo.toISOString())).toBe('20');

    // Someone born 20 years ago, but their birthday hasn't happened yet this year
    const birthDateNotYet = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate() + 1);
    expect(ageCalculator(birthDateNotYet.toISOString())).toBe('19');

    // Someone born 20 years ago, and their birthday just passed this year
    const birthDatePassed = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate() - 1);
    expect(ageCalculator(birthDatePassed.toISOString())).toBe('20');
    
    // Someone born 20 years ago, last month
    const birthDateLastMonth = new Date(today.getFullYear() - 20, today.getMonth() - 1, today.getDate());
    expect(ageCalculator(birthDateLastMonth.toISOString())).toBe('20');
  });
});
