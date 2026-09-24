import { createId } from '../randomIdCreate';

describe('randomIdCreate util', () => {
  it('returns a string of the requested length', () => {
    expect(createId(10)).toHaveLength(10);
    expect(createId(25)).toHaveLength(25);
    expect(createId()).toHaveLength(16); // Default
  });

  it('returns alphanumeric characters only', () => {
    const id = createId(100);
    expect(id).toMatch(/^[a-zA-Z0-9]+$/);
  });

  it('returns different IDs on subsequent calls', () => {
    const id1 = createId(16);
    const id2 = createId(16);
    expect(id1).not.toBe(id2);
  });
});
