export const formatNumber = number => {
  if (number === null || number === undefined || number === '') {
    return 'NaN';
  }
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    minimumIntegerDigits: 2,
  }).format(number);
};

export const extractTextFromHTML = htmlString => {
  if (!htmlString) return '';
  if (typeof window === 'undefined') {
    // Server-side: simple regex to remove HTML tags
    return htmlString
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim();
  }
};
